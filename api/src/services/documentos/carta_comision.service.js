const fs = require("fs").promises;
const path = require("path");
const RUTAS = require("../../config/rutas");
const { mysqlPool } = require("../../config/mysql");
const { ObtenerPlantilla } = require("./encontrarPlantilla.service");
const { GenerarDocumento } = require("./generarDocumento.service");
const { GenerarPDF } = require("./generarPDF.service");
const CartaComision = require("../../models/carta_comision.model");
const Documentos = require("../../models/documentos.model");
const { FormatearFecha } = require("../../utils/fechas.util");
const { subir_archivo, eliminar_archivo } = require("../drive.service");
const { ConvertirCamposMayusculas, ObtenerApellidos, FormatearNombreArchivo } = require("../../utils/textos.util");
const { ObtenerDatosCartaComision } = require("./datos/carta_comision.datos");
const Adscripciones = require("../../models/adscripciones.model");

// ==========================================
// GENERAR CARTA DE COMISIÓN
// ==========================================

async function GenerarCartaComision(datos) {
    let rutaDocumento = null;
    let rutaPDF = null;
    let archivoDrive = null;
    let connection = null;
    let transaccionConfirmada = false;

    try {
        // 1. Obtener adscripción principal
        const adscripcionPrincipal =
            await CartaComision.obtener_adscripcion_principal(datos.Id_Persona);

        if (!adscripcionPrincipal) {
            throw new Error("La persona no tiene una adscripción principal registrada.");
        }

        // 2. Validar fechas de la comisión
        const inicio = new Date(datos.Fecha_Inicio);
        const termino = new Date(datos.Fecha_Termino);

        if (
            !datos.Fecha_Inicio ||
            !datos.Fecha_Termino ||
            Number.isNaN(inicio.getTime()) ||
            Number.isNaN(termino.getTime())
        ) {
            throw new Error("Las fechas de inicio y término son obligatorias y deben ser válidas.");
        }

        if (termino <= inicio) {
            throw new Error("La fecha de término debe ser posterior a la fecha de inicio.");
        }

        // Validar que no exista otra comisión en el mismo periodo
        const existeComision = await Adscripciones.verificar_comision_existente(
            datos.Id_Persona,
            datos.Fecha_Inicio,
            datos.Fecha_Termino,
            mysqlPool
        );

        if (existeComision) {
            throw new Error("Ya existe una comisión registrada que coincide con el periodo seleccionado. Verifica las fechas.");
        }

        // 3. Validar fecha de la carta
        const fechaCarta = new Date(datos.Fecha_Carta);

        if (!datos.Fecha_Carta || Number.isNaN(fechaCarta.getTime())) {
            throw new Error("La fecha del oficio es obligatoria y debe ser válida.");
        }

        // 4. Obtener adscripción actual
        const adscripcionActual =
            await CartaComision.obtener_adscripcion_actual(datos.Id_Persona);

        if (!adscripcionActual) {
            throw new Error("No se encontró la adscripción actual de la persona.");
        }

        // 5. Validar máximo de dos comisiones
        const totalComisiones =
            await CartaComision.contar_comisiones(datos.Id_Persona);

        if (Number(totalComisiones) >= 2) {
            throw new Error("La persona ya tiene el máximo de 2 comisiones permitidas.");
        }

        const numeroComision = Number(totalComisiones) + 1;

        // 6. Obtener unidad de adscripción actual
        const unidadActual =
            await CartaComision.obtener_unidad(adscripcionActual.Id_Unidad_Adscripcion);

        if (!unidadActual) {
            throw new Error("No se encontró la unidad de la adscripción actual.");
        }

        // 7. Validar que la comisión sea en otra unidad
        if (
            Number(datos.Id_Unidad_Comision) ===
            Number(adscripcionActual.Id_Unidad_Adscripcion)
        ) {
            throw new Error(
                "No se puede generar la carta de comisión porque la unidad seleccionada es la misma que la adscripción actual."
            );
        }

        // 8. Obtener carpeta del expediente
        const carpetaExpediente =
            await CartaComision.obtener_carpeta_expediente(
                adscripcionPrincipal.Id_Adscripcion
            );

        if (!carpetaExpediente) {
            throw new Error("No se encontró la carpeta de Drive del expediente.");
        }

        // 9. Preparar datos para la plantilla
        const datosFormateados = {
            ...datos,
            Lugar_Adscripcion: unidadActual.Nombre,
            Fecha_Carta: FormatearFecha(datos.Fecha_Carta),
            Fecha_Inicio: FormatearFecha(datos.Fecha_Inicio),
            Fecha_Termino: FormatearFecha(datos.Fecha_Termino)
        };

        const datosMayusculas = ConvertirCamposMayusculas(
            datosFormateados,
            [
                "Abreviatura_Destinatario",
                "Dirigido_A",
                "Ocupacion_Destinatario",
                "Abreviatura_Alumno",
                "Alumno",
                "Carrera",
                "Escuela",
                "Tipo_Participacion",
                "Lugar_Adscripcion",
                "Lugar_Comision",
                "Ocupacion_Encargado",
                "Abreviatura_Encargado",
                "Encargado"
            ]
        );

        const datosDocumentos =
            ObtenerDatosCartaComision(datosMayusculas);

        // 10. Obtener plantilla
        const plantilla = ObtenerPlantilla("Formato_Presentacion");

        // 11. Generar nombre del archivo
        const fechaSolicitud = new Date()
            .toLocaleDateString("es-MX", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            })
            .replace(/\//g, "-");

        const apellidos = FormatearNombreArchivo(
            ObtenerApellidos(datos.Alumno)
        );

        const nombreArchivo =
            `Carta_Comision_${apellidos}_${fechaSolicitud}_No.${numeroComision}`;

        // 12. Generar documento y PDF
        rutaDocumento = await GenerarDocumento(
            plantilla,
            datosDocumentos,
            nombreArchivo
        );

        rutaPDF = await GenerarPDF(
            rutaDocumento,
            nombreArchivo
        );

        // 13. Subir PDF a Google Drive
        archivoDrive = await subir_archivo(
            `${nombreArchivo}.pdf`,
            rutaPDF,
            carpetaExpediente.Drive_Folder_Id
        );

        console.log("Carta de comisión cargada a Drive:", archivoDrive);

        // 14. Iniciar transacción
        connection = await mysqlPool.getConnection();
        await connection.beginTransaction();

        console.log("Transacción iniciada correctamente.");

        // 15. Registrar comisión en adscripciones
        const idComision = await CartaComision.registrar_comision(
            {
                Fecha_Inicio: datos.Fecha_Inicio,
                Fecha_Termino: datos.Fecha_Termino,
                Id_Persona: datos.Id_Persona,
                Id_Unidad_Comision: datos.Id_Unidad_Comision,
                Id_Tipo_Personal: adscripcionPrincipal.Id_Tipo_Personal_Ad
            },
            connection
        );

        console.log("Comisión registrada. ID:", idComision);

        // 16. Registrar documento
        const resultadoDocumento = await Documentos.crear(
            {
                Nombre: archivoDrive.name,
                Drive_File_Id: archivoDrive.id,
                Mime_Type: archivoDrive.mimeType,
                Tamano: archivoDrive.size,
                Fecha_Subida: new Date(),
                Subido_Por_Usuario: datos.Id_Usuario,
                Id_Carpeta_Documento: carpetaExpediente.Id_Carpeta,
                Id_Tipo_Doc_D: 7
            },
            connection
        );

        console.log("Documento registrado. ID:", resultadoDocumento.insertId);

        // 17. Registrar datos específicos de la carta
        await CartaComision.registrar_carta_comision(
            {
                Id_Documento: resultadoDocumento.insertId,
                Id_Adscripcion: idComision,
                Fecha_Carta: datos.Fecha_Carta,
                Abreviatura_Destinatario: datos.Abreviatura_Destinatario,
                Dirigido_A: datos.Dirigido_A,
                Ocupacion_Destinatario: datos.Ocupacion_Destinatario,
                Abreviatura_Alumno: datos.Abreviatura_Alumno,
                Ocupacion_Encargado: datos.Ocupacion_Encargado,
                Abreviatura_Encargado: datos.Abreviatura_Encargado,
                Encargado: datos.Encargado
            },
            connection
        );

        console.log("Datos específicos de la comisión registrados correctamente.");

        // 18. Confirmar transacción
        await connection.commit();
        transaccionConfirmada = true;

        console.log("Transacción confirmada correctamente.");

        // 19. Devolver resultado
        return {
            documentoWord: path.basename(rutaDocumento),
            documentoPDF: archivoDrive.name,
            archivoWordTemporal: path.basename(rutaDocumento),
            archivoPDFTemporal: path.basename(rutaPDF),
            Drive_File_Id: archivoDrive.id,
            Mime_Type: archivoDrive.mimeType,
            Tamano: archivoDrive.size,
            Id_Adscripcion: idComision,
            Id_Documento: resultadoDocumento.insertId
        };

    } catch (error) {
        console.error("Error en GenerarCartaComision:", error);

        // Revertir transacción si no se confirmó
        if (connection && !transaccionConfirmada) {
            try {
                await connection.rollback();
                console.log("Transacción revertida correctamente.");
            } catch (rollbackError) {
                console.error("Error al hacer rollback:", rollbackError);
            }
        }

        // Eliminar archivo de Drive si falló el registro
        if (archivoDrive?.id && !transaccionConfirmada) {
            try {
                await eliminar_archivo(archivoDrive.id);
                console.log("Archivo de Drive eliminado correctamente.");
            } catch (driveError) {
                console.error("Error al eliminar el archivo de Drive:", driveError);
            }
        }

        throw error;

    } finally {
        if (connection) {
            connection.release();
            console.log("Conexión liberada.");
        }
    }
}

// ==========================================
// OBTENER CARTA DE COMISIÓN
// ==========================================

async function ObtenerCartaComision(idDocumento) {

    // 1. Obtener información del documento
    const documento = await Documentos.obtenerPorId(idDocumento);

    if (!documento) {
        throw new Error("No se encontró el documento de la comisión.");
    }

    // 2. Verificar que sea una comisión
    if (Number(documento.Id_Tipo_Doc_D) !== 7) {
        throw new Error("El documento indicado no corresponde a una comisión.");
    }

    // 3. Obtener datos específicos de la carta
    const carta =
        await CartaComision.obtener_carta_comision_por_documento(idDocumento);

    if (!carta) {
        throw new Error("No se encontraron los datos específicos de la comisión.");
    }

    // 4. Obtener datos de la comisión
    const comision =
        await CartaComision.obtener_comision_por_adscripcion(carta.Id_Adscripcion);

    if (!comision) {
        throw new Error("No se encontró la comisión asociada al documento.");
    }

    // 5. Obtener unidad de la comisión
    const unidad =
        await CartaComision.obtener_unidad(comision.Id_Unidad_Adscripcion);

    return {
        documento,
        carta,
        comision,
        unidad
    };
}

// ==========================================
// ELIMINAR CARTA DE COMISIÓN
// ==========================================

async function EliminarCartaComision(idDocumento) {
    let connection = null;
    let transaccionConfirmada = false;
    let documento = null;
    let comision = null;

    try {
        // 1. Obtener documento
        documento = await Documentos.obtenerPorId(idDocumento);

        if (!documento) {
            throw new Error("No se encontró el documento de comisión.");
        }

        // 2. Validar tipo de documento
        if (Number(documento.Id_Tipo_Doc_D) !== 7) {
            throw new Error("El documento seleccionado no corresponde a una comisión.");
        }

        const carta =
            await CartaComision.obtener_carta_comision_por_documento(idDocumento);

        if (!carta) {
            throw new Error("No se encontraron los datos de la comisión.");
        }

        // 3. Obtener comisión
        comision =
            await CartaComision.obtener_comision_por_adscripcion(carta.Id_Adscripcion);

        if (!comision) {
            throw new Error("La adscripción asociada al documento no corresponde a una comisión.");
        }

        // 4. Obtener comisiones de la persona
        const comisiones =
            await CartaComision.obtener_comisiones(comision.Id_Persona_Adscripcion);

        if (comisiones.length === 0) {
            throw new Error("No se encontraron comisiones para esta persona.");
        }

        // 5. Validar que sea la última comisión
        const ultimaComision = comisiones[comisiones.length - 1];

        if (
            Number(comision.Id_Adscripcion) !==
            Number(ultimaComision.Id_Adscripcion)
        ) {
            throw new Error(
                "No se puede eliminar la Comision No. 1. Primero debe eliminar la Comisión No. 2."
            );
        }

        // 6. Iniciar transacción
        connection = await mysqlPool.getConnection();
        await connection.beginTransaction();

        console.log("Transacción iniciada para eliminar comisión.");

        // 7. Eliminar datos específicos de la carta en MySQL
        await CartaComision.eliminar_carta_comision(
            documento.Id_Documento,
            connection
        );

        console.log("Datos específicos de la comisión eliminados de MySQL.");

        // 8. Eliminar documento de MySQL
        await Documentos.eliminar(
            documento.Id_Documento,
            connection
        );

        console.log("Documento eliminado de MySQL.");

        // 9. Eliminar comisión de adscripciones en MySQL
        await CartaComision.eliminar_comision(
            comision.Id_Adscripcion,
            connection
        );

        console.log("Comisión eliminada de MySQL.");

        // 10. Confirmar transacción
        await connection.commit();
        transaccionConfirmada = true;

        console.log("Transacción confirmada correctamente.");

        // 11. Eliminar archivo de Google Drive
        let archivoDriveEliminado = true;

        try {
            await eliminar_archivo(documento.Drive_File_Id);
            console.log("Archivo eliminado de Google Drive.");

        } catch (driveError) {
            archivoDriveEliminado = false;

            console.error(
                "La base de datos se actualizó, pero no se pudo eliminar el archivo de Drive:",
                driveError
            );
        }

        // 12. Devolver resultado
        return {
            Id_Documento: documento.Id_Documento,
            Id_Adscripcion: comision.Id_Adscripcion,
            Nombre: documento.Nombre,
            Archivo_Drive_Eliminado: archivoDriveEliminado
        };

    } catch (error) {
        console.error("Error en EliminarCartaComision:", error);

        // Revertir transacción si no se confirmó
        if (connection && !transaccionConfirmada) {
            try {
                await connection.rollback();
                console.log("Transacción revertida correctamente.");
            } catch (rollbackError) {
                console.error("Error al hacer rollback:", rollbackError);
            }
        }

        throw error;

    } finally {
        if (connection) {
            connection.release();
            console.log("Conexión liberada.");
        }
    }
}


// ==========================================
// ELIMINAR ARCHIVOS TEMPORALES
// ==========================================

async function EliminarTemporalesCartaComision(datos) {
    if (!datos || typeof datos !== "object") {
        throw new Error("No se recibieron los datos de los archivos temporales.");
    }

    const { archivoWordTemporal, archivoPDFTemporal } = datos;

    // VALIDAR NOMBRE DEL WORD
    if (
        typeof archivoWordTemporal !== "string" ||
        path.basename(archivoWordTemporal) !== archivoWordTemporal ||
        path.extname(archivoWordTemporal).toLowerCase() !== ".docx"
    ) {
        throw new Error("El nombre del documento Word temporal no es válido.");
    }

    // VALIDAR NOMBRE DEL PDF
    if (
        typeof archivoPDFTemporal !== "string" ||
        path.basename(archivoPDFTemporal) !== archivoPDFTemporal ||
        path.extname(archivoPDFTemporal).toLowerCase() !== ".pdf"
    ) {
        throw new Error("El nombre del documento PDF temporal no es válido.");
    }

    // CONSTRUIR RUTAS TEMPORALES
    const rutaWord = path.join(
        RUTAS.temporalesDocx,
        archivoWordTemporal
    );

    const rutaPDF = path.join(
        RUTAS.temporalesPdf,
        archivoPDFTemporal
    );

    // ELIMINAR LOS ARCHIVOS
    for (const ruta of [rutaWord, rutaPDF]) {
        try {
            await fs.unlink(ruta);
        } catch (error) {
            if (error.code !== "ENOENT") {
                throw error;
            }
        }
    }

    return {
        mensaje: "Los archivos temporales de la carta de comisión se eliminaron correctamente."
    };
}

// ==========================================
// CONTAR COMISIONES DE UNA PERSONA
// ==========================================

async function ContarComisionesPersona(idPersona) {
    if (!idPersona) {
        throw new Error("No se recibió el ID de la persona.");
    }
    const totalComisiones = await CartaComision.contar_comisiones(idPersona);
    return Number(totalComisiones);
}

module.exports = { GenerarCartaComision, ObtenerCartaComision, EliminarCartaComision, EliminarTemporalesCartaComision, ContarComisionesPersona };