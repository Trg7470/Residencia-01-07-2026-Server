const fs = require("fs").promises;
const path = require("path");
const RUTAS = require("../../config/rutas");
const { ObtenerPlantilla } = require("./encontrarPlantilla.service");
const { ObtenerDatosConstanciaSS } = require("./datos/carta_constancia_ss.datos");
const { GenerarDocumento } = require("./generarDocumento.service");
const { GenerarPDF } = require("./generarPDF.service");
const { subir_archivo, listar_archivos_carpeta, actualizar_archivo, obtener_archivo } = require("../../services/drive.service");
const { drive } = require("googleapis/build/src/apis/drive");

async function GenerarCartaConstanciaSS(datosFormulario) {
    // Obtener plantilla
    const plantilla = ObtenerPlantilla("Formato_Constancia_Servicio_Social");

    // Obtener y preparar datos
    const datos = await ObtenerDatosConstanciaSS(datosFormulario);
    console.log("DATOS PARA GENERAR WORD:", datos);

    // Obtener apellidos del alumno
    const apellidoPaterno = (datos.Apellido_Paterno || "").trim().replace(/\s+/g, "_");
    const apellidoMaterno = (datos.Apellido_Materno || "").trim().replace(/\s+/g, "_");

    // Nombre base de los archivos
    const nombreArchivo = `Constancia_Servicio_Social_${apellidoPaterno}_${apellidoMaterno}`;

    // Generar documento word
    const rutaDocumento = await GenerarDocumento(
        plantilla,
        datos,
        nombreArchivo
    );

    // Generar PDF
    const rutaPDF = await GenerarPDF(
        rutaDocumento,
        nombreArchivo
    );

    // Validar carpeta de Google Drive
    if (!datos.Drive_Folder_Id) {
        throw new Error ("No se recibió la carpeta de Google Drive del expediente.");
    }

    const nombrePDF = `${nombreArchivo}.pdf`;

    // Buscar archivos dentro de la carpeta del expediente
    const archivos = await listar_archivos_carpeta(datos.Drive_Folder_Id);

    // Buscar el PDF por nombre
    const pdfExistente = archivos.find(
        archivo => archivo.name === nombrePDF
    );

    let resultadoDrive;

    if(pdfExistente) {
        // Si ya existe, reemplazarlo
        await actualizar_archivo(
            pdfExistente.id,
            rutaPDF
        );

        // Obtener los metadatos actualizados
        resultadoDrive = await obtener_archivo(
            pdfExistente.id
        );

        console.log("PDF actualizado en Google Drive:", nombrePDF);

    } else {
        // Subir PDF nuevo
        resultadoDrive = await subir_archivo(
            nombrePDF, 
            rutaPDF,
            datos.Drive_Folder_Id
        );

        console.log("PDF nuevo subido a Google Drive:", nombrePDF);
    }

    // Devolver datos del PDF y su ubicación
    return{
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

// Eliminar archivos temporales
async function EliminarTemporalesConstanciaSS(datos) {
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

        if (nombreArchivo !== archivo.nombre || path.extname(nombreArchivo).toLowerCase() !== archivo.extension) {
            throw new Error ("Nombre de archivo temporal no válido.");
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

module.exports = { GenerarCartaConstanciaSS, EliminarTemporalesConstanciaSS };