const fs = require("fs").promises;
const path = require("path");
const RUTAS = require("../../config/rutas");
const { ObtenerPlantilla } = require("./encontrarPlantilla.service");
const { GenerarDocumento } = require("./generarDocumento.service");
const { GenerarPDF } = require("./generarPDF.service");
const { subir_archivo, listar_archivos_carpeta, actualizar_archivo, obtener_archivo } = require("../../services/drive.service");
const { arch } = require("os");

async function GenerarCartaConfidencialidad(datos) {
    const plantilla = ObtenerPlantilla("Formato_Carta_Confidencialidad");
    const nombreBase = `Carta_Confidencialidad_${datos.Apellido_Paterno}_${datos.Apellido_Materno}`;
    
    let rutaDocumento = null;
    let rutaPDF = null;

    try {
        rutaDocumento = await GenerarDocumento(
            plantilla,
            datos,
            nombreBase
        );

        rutaPDF = await GenerarPDF(
            rutaDocumento,
            nombreBase
        );

        if (!datos.Drive_Folder_Id) {
            throw new Error("No se recibió la carpeta de Google Drive del expediente.");
        }

        const nombrePDF = `${nombreBase}.pdf`;
        const archivos = await listar_archivos_carpeta(datos.Drive_Folder_Id);
        const pdfExistente = archivos.find(archivo => archivo.name === nombrePDF);

        let resultadoDrive;

        if (pdfExistente) {
            await actualizar_archivo(pdfExistente.id, rutaPDF);
            resultadoDrive = await obtener_archivo(pdfExistente.id);
            console.log("PDF actualizado en Google Drive:", nombrePDF);
        } else {
            resultadoDrive = await subir_archivo(
                nombrePDF,
                rutaPDF,
                datos.Drive_Folder_Id
            );
            console.log("PDF nuevo cargado a Google Drive:", nombrePDF);
        }

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
        for (const ruta of [rutaDocumento, rutaPDF]) {
            if (!ruta) continue;
            try {
                await fs.unlink(ruta);
                console.log("Archivo temporal eliminado por error:", path.basename(ruta));
            } catch (errorEliminar) {
                if (errorEliminar.code !== "ENOENT") {
                    console.error("Error al eliminar archivo temporal:", errorEliminar);
                }
            }
        }
        throw error;
    }
}

async function EliminarTemporalesCartaConfidencialidad(datos) {
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
            console.log("Archivo temporal eliminado:", nombreArchivo);
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

module.exports = { GenerarCartaConfidencialidad, EliminarTemporalesCartaConfidencialidad };