const { ObtenerPlantilla } = require("./encontrarPlantilla.service");
const { GenerarDocumento } = require("./generarDocumento.service");
const { GenerarPDF } = require("./generarPDF.service");

// Servicio de Google Drive
const { subir_archivo } = require("../drive.service");

async function GenerarIncidenciasBecarios(data) {

    try {
        console.log("GENERANDO INCIDENCIA PARA BECARIO");
        console.log("Datos recibidos:",data);
        // VALIDAR CARPETA DE GOOGLE DRIVE
        if (!data.Drive_Folder_Id) {
            throw new Error("No se recibió el Drive_Folder_Id del expediente.");
        }
        // OBTENER PLANTILLA
        const plantilla = ObtenerPlantilla("Formato_Incidencias_Becarios");
        console.log("Plantilla encontrada:",plantilla);
        // OBTENER APELLIDOS PARA EL NOMBRE DEL ARCHIVO
        const nombreCompleto =(data.Nombre_Becario || "").trim();
        const partesNombre =nombreCompleto.split(/\s+/);
        let apellidoPat = "";
        let apellidoMat = "";

        if (partesNombre.length >= 2) {
            apellidoMat =partesNombre[partesNombre.length - 1];
            apellidoPat =partesNombre[partesNombre.length - 2];
        }
        // FECHA PARA EL NOMBRE DEL ARCHIVO
        const fecha =new Date();
        const anio =fecha.getFullYear();
        const mes =String(fecha.getMonth() + 1).padStart(2, "0");
        const dia =String(fecha.getDate()).padStart(2, "0");
        // NOMBRE DEL DOCUMENTO
        const nombreArchivo =`Incidencias_Becarios_${apellidoPat}_${apellidoMat}_${anio}-${mes}-${dia}`;
        console.log("Nombre del archivo:",nombreArchivo);
        // GENERAR WORD
        const rutaDocumento =await GenerarDocumento(plantilla,data,nombreArchivo);
        console.log("Word generado:",rutaDocumento);
        // GENERAR PDF
        const rutaPDF =await GenerarPDF(rutaDocumento,nombreArchivo);
        console.log("PDF generado:",rutaPDF);
        // CARPETA DE GOOGLE DRIVE
        const carpetaDrive =data.Drive_Folder_Id;
        console.log("Carpeta Drive del expediente:",carpetaDrive);
        // SUBIR WORD A GOOGLE DRIVE
        console.log("Cargando documento Word a Google Drive...");
        const archivoWordDrive =await subir_archivo(`${nombreArchivo}.docx`,rutaDocumento,carpetaDrive);
        console.log("Documento cargado correctamente:",archivoWordDrive);
        // SUBIR PDF A GOOGLE DRIVE
        console.log("Cargando documento PDF a Google Drive...");
        const archivoPDFDrive =await subir_archivo(`${nombreArchivo}.pdf`,rutaPDF,carpetaDrive);
        console.log("PDF cargado correctamente:",archivoPDFDrive);
        // RESULTADO
        return {
            // Rutas locales
            docx:rutaDocumento,
            pdf:rutaPDF,
            // Información de Drive
            driveFolderId:carpetaDrive,
            driveWord:archivoWordDrive,
            drivePDF:archivoPDFDrive
        };
    } catch (error) {
        console.error("ERROR GENERANDO INCIDENCIA DE BECARIOS");
        console.error(error);
        throw error;
    }
}
module.exports = {
    GenerarIncidenciasBecarios
};