const fs = require("fs").promises;
const path = require("path");
const RUTAS = require("../../config/rutas");
const { ObtenerPlantilla } = require("./encontrarPlantilla.service");
const { GenerarDocumento } = require("./generarDocumento.service");
const { GenerarPDF } = require("./generarPDF.service");
const { subir_archivo, listar_archivos_carpeta, actualizar_archivo, obtener_archivo } = require("../../services/drive.service");

// Generar Carta Compromiso
async function GenerarCartaCompromiso(datos) {
    const plantilla = ObtenerPlantilla(
        "Formato_Carta_Compromiso_Y_Consentimiento_Informado"
    );

    const nombreBase = `Carta_Compromiso_${(datos.Apellido_Paterno || "").trim().replace(/\s+/g, "_")}_${(datos.Apellido_Materno || "").trim().replace(/\s+/g, "_")}`;

    let rutaDocumento = null;
    let rutaPDF = null;

    try {
        // Generar documento Word
        rutaDocumento = await GenerarDocumento(
            plantilla,
            datos,
            nombreBase
        );

        // Generar PDF
        rutaPDF = await GenerarPDF(
            rutaDocumento,
            nombreBase
        );

        // Validar carpeta de Google Drive
        if (!datos.Drive_Folder_Id) {
            throw new Error(
                "No se recibió la carpeta de Google Drive del expediente."
            );
        }

        const nombrePDF = `${nombreBase}.pdf`;

        // Buscar archivos dentro de la carpeta del expediente
        const archivos = await listar_archivos_carpeta(
            datos.Drive_Folder_Id
        );

        // Buscar PDF existente
        const pdfExistente = archivos.find(
            archivo => archivo.name === nombrePDF
        );

        let resultadoDrive;

        if (pdfExistente) {
            // Actualizar PDF existente
            await actualizar_archivo(
                pdfExistente.id,
                rutaPDF
            );

            resultadoDrive = await obtener_archivo(
                pdfExistente.id
            );

            console.log(
                "PDF actualizado en Google Drive:",
                nombrePDF
            );

        } else {

            // Subir PDF nuevo
            resultadoDrive = await subir_archivo(
                nombrePDF,
                rutaPDF,
                datos.Drive_Folder_Id
            );

            console.log(
                "PDF nuevo subido a Google Drive:",
                nombrePDF
            );
        }

        // Devolver información del documento
        return {
            docx: rutaDocumento,
            pdf: rutaPDF,
            documentoWord: path.basename(rutaDocumento),
            documentoPDF: resultadoDrive.name,
            archivoWordTemporal: path.basename(rutaDocumento),
            archivoPDFTemporal: path.basename(rutaPDF),
            Drive_File_Id: resultadoDrive.id,
            MimeType: resultadoDrive.mimeType,
            Tamano: resultadoDrive.size
        };

    } catch (error) {

        // Intentar eliminar los archivos si ocurrió un error
        // durante la generación o el proceso de Google Drive
        for (const ruta of [rutaDocumento, rutaPDF]) {

            if (!ruta) continue;

            try {
                await fs.unlink(ruta);
                console.log(
                    "Archivo temporal eliminado por error:",
                    path.basename(ruta)
                );
            } catch (errorEliminar) {
                if (errorEliminar.code !== "ENOENT") {
                    console.error(
                        "Error al eliminar archivo temporal:",
                        errorEliminar
                    );
                }
            }
        }

        throw error;
    }
}


// Eliminar archivos temporales
async function EliminarTemporalesCartaCompromiso(datos) {

    const archivos = [
        {
            nombre: datos.archivoWordTemporal,
            directorio: RUTAS.temporalesDocx,
            extension: ".docx"
        },
        {
            nombre: datos.archivoPDFTemporal,
            directorio: RUTAS.temporalesPdf,
            extension: ".pdf"
        }
    ];

    for (const archivo of archivos) {
        if (!archivo.nombre) continue;
        const nombreArchivo = path.basename(archivo.nombre);
        if (
            nombreArchivo !== archivo.nombre ||
            path.extname(nombreArchivo).toLowerCase() !== archivo.extension
        ) {
            throw new Error("Nombre de archivo temporal no válido.");
        }

        const rutaArchivo = path.join(
            archivo.directorio,
            nombreArchivo
        );

        try {

            await fs.unlink(rutaArchivo);

            console.log(
                "Archivo temporal eliminado:",
                nombreArchivo
            );

        } catch (error) {

            if (error.code !== "ENOENT") {
                throw error;
            }
        }
    }
    return {
        mensaje: "Archivos temporales eliminados correctamente."
    };
}

module.exports = { GenerarCartaCompromiso, EliminarTemporalesCartaCompromiso }