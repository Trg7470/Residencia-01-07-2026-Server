const fs = require("fs").promises;
const path = require("path");
const RUTAS = require("../../config/rutas");
const { mysqlPool } = require("../../config/mysql");
const Expedientes = require("../../models/expedientes.model");
const Documentos = require("../../models/documentos.model");
const VacacionesBecarios = require("../../models/vacaciones_becarios.model");
const { ObtenerPlantilla } = require("./encontrarPlantilla.service");
const { GenerarDocumento } = require("./generarDocumento.service");
const { GenerarPDF } = require("./generarPDF.service");
const { ObtenerDatosVacacionesBecarios } = require("./datos/vacaciones_becarios.datos");
const { subir_archivo, eliminar_archivo } = require("../../services/drive.service");

// Convertir DD/MM/AAAA a AAAA-MM-DD
function ConvertirFechaMySQL(fechaMX) {
    const partes = fechaMX.split("/");

    if (partes.length !== 3) {
        throw new Error("La fecha debe tener el formato DD/MM/AAAA.");
    }

    const [dia, mes, anio] = partes;

    const fecha = new Date(
        Number(anio),
        Number(mes) - 1,
        Number(dia),
        12
    );

    if (
        fecha.getDate() !== Number(dia) ||
        fecha.getMonth() !== Number(mes) - 1 ||
        fecha.getFullYear() !== Number(anio)
    ) {
        throw new Error("La fecha proporcionada no es válida.");
    }

    return `${anio}-${mes}-${dia}`;
}

// Calcular fecha final contando únicamente días hábiles
function CalcularFechaFinal(fechaInicio, cantidadDias) {
    const fechaISO = ConvertirFechaMySQL(fechaInicio);
    const [anio, mes, dia] = fechaISO.split("-").map(Number);

    const fecha = new Date(anio, mes - 1, dia, 12);

    if (fecha.getDay() === 0 || fecha.getDay() === 6) {
        throw new Error("Las vacaciones deben iniciar en un día hábil.");
    }

    let diasContados = 0;

    while (diasContados < cantidadDias) {
        const diaSemana = fecha.getDay();

        if (diaSemana !== 0 && diaSemana !== 6) {
            diasContados++;
        }

        if (diasContados < cantidadDias) {
            fecha.setDate(fecha.getDate() + 1);
        }
    }

    const diaFinal = String(fecha.getDate()).padStart(2, "0");
    const mesFinal = String(fecha.getMonth() + 1).padStart(2, "0");
    const anioFinal = fecha.getFullYear();

    return `${diaFinal}/${mesFinal}/${anioFinal}`;
}

// Calcular fecha de regreso
function CalcularFechaRegreso(fechaFinal) {
    const fechaISO = ConvertirFechaMySQL(fechaFinal);
    const [anio, mes, dia] = fechaISO.split("-").map(Number);

    const fecha = new Date(anio, mes - 1, dia, 12);

    fecha.setDate(fecha.getDate() + 1);

    if (fecha.getDay() === 6) {
        fecha.setDate(fecha.getDate() + 2);
    } else if (fecha.getDay() === 0) {
        fecha.setDate(fecha.getDate() + 1);
    }

    const diaRegreso = String(fecha.getDate()).padStart(2, "0");
    const mesRegreso = String(fecha.getMonth() + 1).padStart(2, "0");
    const anioRegreso = fecha.getFullYear();

    return `${diaRegreso}/${mesRegreso}/${anioRegreso}`;
}

// Validar disponibilidad de días
async function ValidarDiasDisponibles(
    Id_Carpeta,
    Periodo,
    Cantidad_Dias,
    Anio,
    connection = mysqlPool
) {
    const diasPeriodo1 = await VacacionesBecarios.obtenerDiasUtilizados(
        Id_Carpeta,
        1,
        Anio,
        connection
    );

    const diasPeriodo2 = await VacacionesBecarios.obtenerDiasUtilizados(
        Id_Carpeta,
        2,
        Anio,
        connection
    );

    if (diasPeriodo1 > 10 || diasPeriodo2 > 10) {
        throw new Error("El expediente tiene un registro de vacaciones inválido.");
    }

    if (Periodo === 2 && diasPeriodo1 !== 10) {
        throw new Error(
            "El segundo periodo estará disponible cuando se hayan utilizado los 10 días del primer periodo."
        );
    }

    const diasUtilizados = Periodo === 1
        ? diasPeriodo1
        : diasPeriodo2;

    const diasDisponibles = 10 - diasUtilizados;

    if (Cantidad_Dias > diasDisponibles) {
        throw new Error(
            `Solo tienes ${diasDisponibles} días disponibles en el periodo ${Periodo} del año ${Anio}.`
        );
    }

    return {
        diasPeriodo1,
        diasPeriodo2,
        diasUtilizados,
        diasDisponibles: diasDisponibles - Cantidad_Dias
    };
}

// Generar y registrar una solicitud de vacaciones
async function GenerarVacacionesBecarios(datos) {
    let rutaDocumento = null;
    let rutaPDF = null;
    let resultadoDrive = null;
    let conexion = null;
    let transaccionIniciada = false;
    let registroCompletado = false;

    try {
        if (!datos || typeof datos !== "object") {
            throw new Error("No se recibieron los datos de la solicitud de vacaciones.");
        }

        const Id_Carpeta = Number(datos.expedienteId);
        const Periodo = Number(datos.Periodo);
        const Cantidad_Dias = Number(datos.Cantidad_Dias);
        const Cuenta_Dias_Festivos = datos.Cuenta_Dias_Festivos;
        const Cantidad_Dias_Festivos = Number(datos.Cantidad_Dias_Festivos);

        if (!Number.isInteger(Id_Carpeta) || Id_Carpeta <= 0) {
            throw new Error("El expediente no es válido.");
        }

        if (![1, 2].includes(Periodo)) {
            throw new Error("El periodo de vacaciones no es válido.");
        }

        if (
            !Number.isInteger(Cantidad_Dias) ||
            Cantidad_Dias < 1 ||
            Cantidad_Dias > 10
        ) {
            throw new Error("La cantidad de dias solicitada no es válida.");
        }

        // Validar dias festivos
        if (typeof Cuenta_Dias_Festivos !== "boolean") {
            throw new Error("Debes indicar si se consideran días festivos.");
        }

        if (
            Cuenta_Dias_Festivos &&
            (
                !Number.isInteger(Cantidad_Dias_Festivos) ||
                Cantidad_Dias_Festivos < 1 ||
                Cantidad_Dias_Festivos > 10
            )
        ) {
            throw new Error("La cantidad de días festivos no es válida.");
        }

        if (!Cuenta_Dias_Festivos && Cantidad_Dias_Festivos !==  0) {
            throw new Error("La cantidad de días festivos debe ser cero cuando no se consideran festivos.");
        }

        if (!datos.Periodo_De) {
            throw new Error("Debes indicar la fecha de inicio de vacaciones.");
        }

        if (!datos.Drive_Folder_Id) {
            throw new Error("No se encontró la carpeta de Google Drive del expediente.");
        }

        if (!datos.Subido_Por_Usuario) {
            throw new Error("No se identificó al usuario que registra el documento.");
        }

        // Calcular fechas de vacaciones considerando días festivos
        const diasTotales = Cantidad_Dias + Cantidad_Dias_Festivos;

        const Periodo_A = CalcularFechaFinal(
            datos.Periodo_De,
            diasTotales
        );

        const Fecha_Regreso = CalcularFechaRegreso(Periodo_A);

        // Convertir fechas para MySQL
        const Periodo_De_DB = ConvertirFechaMySQL(datos.Periodo_De);
        const Periodo_A_DB = ConvertirFechaMySQL(Periodo_A);
        const Fecha_Regreso_DB = ConvertirFechaMySQL(Fecha_Regreso);

        // Obtener el año al que pertenecen las vacaciones solicitadas
        const AnioVacaciones = Number(Periodo_De_DB.substring(0, 4));
        
        // Iniciar transaccion MySQL y bloquear el expediente
        conexion = await mysqlPool.getConnection();
        await conexion.beginTransaction();
        transaccionIniciada = true;

        const expedienteBloqueado = await Expedientes.bloquear_expediente(
            Id_Carpeta,
            conexion
        );

        if (!expedienteBloqueado) {
            throw new Error("No se encontró el expediente seleccionado.");
        }

        // Validar disponibilidad de días dentro de la transacción
        const balance = await ValidarDiasDisponibles(
            Id_Carpeta,
            Periodo,
            Cantidad_Dias,
            AnioVacaciones,
            conexion
        );

        // Verificar que las fechas solicitadas no estén ocupadas
        const fechasUtilizadas = await VacacionesBecarios.verificarFechasUtilizadas(
            Id_Carpeta,
            Periodo_De_DB,
            Periodo_A_DB,
            conexion
        );

        if (fechasUtilizadas) {
            const error = new Error(
                "Las fechas solicitadas coinciden con un periodo de vacaciones que ya está registrado. Selecciona otras fechas."
            );

            error.status = 409;
            throw error;
        }

        // Obtener plantilla
        const plantilla = ObtenerPlantilla("Formato_Vacaciones_Becarios");


        // Prepara datos del documento
        const datosPlantilla = ObtenerDatosVacacionesBecarios({
            ...datos,
            Periodo,
            Cantidad_Dias,
            Periodo_A,
            Fecha_Regreso
        });

        console.log("Datos para vacaciones becarios:", datosPlantilla);

        const fechaActual = new Date();

        const fechaSolicitud = fechaActual.toLocaleString("sv-SE", {
            timeZone: "America/Mexico_City"
        }).replace(" ", "_").replace(/:/g, "-");

        const apellidoPaterno = (datos.Apellido_Paterno || "").trim().replace(/\s+/g, "-");
        const apellidoMaterno = (datos.Apellido_Materno || "").trim().replace(/\s+/g, "-");
        const nombreArchivo = `Vacaciones_Becarios_${apellidoPaterno}_${apellidoMaterno}_${fechaSolicitud}`;
        console.log("Nombre del archivo:", nombreArchivo);

        // Generar Word temporal
        rutaDocumento = await GenerarDocumento(
            plantilla,
            datosPlantilla,
            nombreArchivo
        );

        // Generar pdf temporal
        rutaPDF = await GenerarPDF(
            rutaDocumento,
            nombreArchivo
        );

        // Subir pdf como archivo nuevo a google drive
        const nombrePDF = `${nombreArchivo}.pdf`;

        resultadoDrive = await subir_archivo(nombrePDF, rutaPDF, datos.Drive_Folder_Id);

        if (!resultadoDrive || !resultadoDrive.id) {
            throw new Error("Google Drive no devolvió el identificador del PDF.");
        }

        // Registrar documento en MySQL
        const resultadoDocumento = await Documentos.crear(
            {
                Nombre: resultadoDrive.name,
                Drive_File_Id: resultadoDrive.id,
                Mime_Type: resultadoDrive.mimeType || "application/pdf",
                Tamano: Number(resultadoDrive.size) || 0,
                Fecha_Subida: new Date(),
                Subido_Por_Usuario: datos.Subido_Por_Usuario,
                Id_Carpeta_Documento: Id_Carpeta,
                Id_Tipo_Doc_D: 5
            },
            conexion
        );

        // Registrar solicitud de vacaciones
        await VacacionesBecarios.crear(
            {
                Id_Carpeta,
                Id_Documento: resultadoDocumento.insertId,
                Periodo,
                Cantidad_Dias,
                Periodo_De: Periodo_De_DB,
                Periodo_A: Periodo_A_DB,
                Fecha_Regreso: Fecha_Regreso_DB
            },
            conexion
        );

        // Confirmar ambos registros
        await conexion.commit();
        transaccionIniciada = false;
        registroCompletado = true;

        return {
            documentoWord: path.basename(rutaDocumento),
            documentoPDF: resultadoDrive.name,
            archivoWordTemporal: path.basename(rutaDocumento),
            archivoPDFTemporal: path.basename(rutaPDF),
            Drive_File_Id: resultadoDrive.id,
            Mime_Type: resultadoDrive.mimeType,
            Tamano: resultadoDrive.size,
            Id_Documento: resultadoDocumento.insertId,
            Periodo,
            Cantidad_Dias,
            diasUtilizados: balance.diasUtilizados + Cantidad_Dias,
            diasDisponibles: balance.diasDisponibles,
            periodo2Disponible: balance.diasPeriodo1 + (Periodo === 1 ? Cantidad_Dias : 0) === 10
        };
    } catch (error) {
        // Revertir registros de mySQL si hubo algun error
        if (conexion && transaccionIniciada) {
            try {
                await conexion.rollback();
            } catch (errorRollback) {
                console.error("Error al revertir transacción:", errorRollback);
            }
        }

        // Si el pdf se sube pero no hay registro en la base de datos
        if (resultadoDrive && resultadoDrive.id && !registroCompletado) {
            try {
                await eliminar_archivo(resultadoDrive.id);
            } catch (errorDrive) {
                console.error("No se pudo eliminar el PDF de Google Drive:", errorDrive);
            }
        }

        throw error;
    } finally {
        if (conexion) {
            conexion.release();
        }
    }
}

// Eliminar archivos temporales

async function EliminarTemporalesVacaciones(datos) {
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
        mensaje: "Los archivos temporales de vacaciones se eliminaron correctamente."
    };
}


module.exports = { GenerarVacacionesBecarios, EliminarTemporalesVacaciones };