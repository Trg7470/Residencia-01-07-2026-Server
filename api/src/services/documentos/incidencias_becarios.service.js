const fs = require("fs").promises;
const path = require("path");
const RUTAS = require("../../config/rutas");
const { ObtenerPlantilla } = require("./encontrarPlantilla.service");
const { ObtenerDatosIncidenciasBecarios } = require("./datos/incidencias_becarios.datos");
const { GenerarDocumento } = require("./generarDocumento.service");
const { GenerarPDF } = require("./generarPDF.service");
const { subir_archivo, listar_archivos_carpeta, actualizar_archivo, obtener_archivo } = require("../../services/drive.service");

async function GenerarIncidenciasBecarios(datosFormulario) {
    // Obtener plantilla
    const plantilla = ObtenerPlantilla("Formato_Incidencias_Becarios");

    // Obtener datos
    const datos = ObtenerDatosIncidenciasBecarios(datosFormulario);

    // Nombre del archivo con los apellidos
    const apellidoPaterno = (datosFormulario.Apellido_Paterno || "").trim().replace(/\s+/g, "_");
    const apellidoMaterno = (datosFormulario.Apellido_Materno || "").trim().replace(/\s+/g, "_");
    const nombreArchivo = `Incidencias_Becarios_${apellidoPaterno}_${apellidoMaterno}`;

    // Generar Word y PDF
    const rutaDocumento = await GenerarDocumento(
        plantilla,
        datos,
        nombreArchivo
    );

    const rutaPDF = await GenerarPDF(
        rutaDocumento,
        nombreArchivo
    );

    // Validar carpeta de Google Drive
    if (!datosFormulario.Drive_Folder_Id) {
        throw new Error("No se recibió la carpeta de Google Drive del expediente.");
    }

    // Buscar si el PDF ya existe en la carpeta
    const nombrePDF = `${nombreArchivo}.pdf`;

    const archivos = await listar_archivos_carpeta(
        datosFormulario.Drive_Folder_Id
    );

    const pdfExistente = archivos.find(
        archivo => archivo.name === nombrePDF
    );

    let resultadoDrive;

    if (pdfExistente) {
        // Actualizar PDF
        await actualizar_archivo(pdfExistente.id, rutaPDF);
        resultadoDrive = await obtener_archivo(pdfExistente.id);
    } else {
        // Subir PDF nuevo
        resultadoDrive = await subir_archivo(
            nombrePDF,
            rutaPDF,
            datosFormulario.Drive_Folder_Id
        );
    }

    // Devolver datos del PDF y nombres de los archivos temporales
    return {
        docx: rutaDocumento,
        pdf: rutaPDF,
        documentoWord: path.basename(rutaDocumento),
        documentoPDF: resultadoDrive.name,
        archivoWordTemporal: path.basename(rutaDocumento),
        archivoPDFTemporal: path.basename(rutaPDF),
        Drive_File_Id: resultadoDrive.id,
        MimeType: resultadoDrive.mimeType,
        Tamano: resultadoDrive.size,
        drivePDF: resultadoDrive
    };
}

// ELIMINAR ARCHIVOS TEMPORALES DE INCIDENCIAS
async function EliminarTemporalesIncidencias(datos) {
    const { archivoWordTemporal, archivoPDFTemporal } = datos;

    // Validar que sean únicamente nombres de archivo
    if (
        typeof archivoWordTemporal !== "string" ||
        path.basename(archivoWordTemporal) !== archivoWordTemporal ||
        path.extname(archivoWordTemporal).toLowerCase() !== ".docx"
    ) {
        throw new Error("El nombre del documento Word temporal no es válido.");
    }

    if (
        typeof archivoPDFTemporal !== "string" ||
        path.basename(archivoPDFTemporal) !== archivoPDFTemporal ||
        path.extname(archivoPDFTemporal).toLowerCase() !== ".pdf"
    ) {
        throw new Error("El nombre del documento PDF temporal no es válido.");
    }

    // Construir rutas dentro de las carpetas temporales
    const rutaWord = path.join(
        RUTAS.temporalesDocx,
        archivoWordTemporal
    );

    const rutaPDF = path.join(
        RUTAS.temporalesPdf,
        archivoPDFTemporal
    );

    // Eliminar unicamente los dos archivos indicados
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
        mensaje: "Los archivos temporales se eliminaron correctamente."
    };
}

module.exports = { GenerarIncidenciasBecarios, EliminarTemporalesIncidencias };