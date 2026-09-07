const path = require("path");
const {GenerarIncidenciasBecarios} = require("../../services/documentos/incidencias_becarios.service");
async function GenerarIncidenciasBecariosController(req, res) {
    try {
        console.log("SOLICITUD PARA GENERAR INCIDENCIA DE BECARIO");
        console.log("Body recibido:",req.body);
        // VALIDAR DATOS
        if (!req.body) {
            return res.status(400).json({
                mensaje:"No se recibieron datos para generar el formato."
            });
        }
        // VALIDAR ID DE CARPETA DEL EXPEDIENTE
        if (!req.body.Id_Carpeta) {
            return res.status(400).json({
                mensaje:"No se recibió el Id_Carpeta del expediente."
            });
        }
        // VALIDAR CARPETA DE GOOGLE DRIVE
        if (!req.body.Drive_Folder_Id) {
            return res.status(400).json({
                mensaje:"No se recibió la carpeta de Google Drive del expediente."
            });
        }
        // GENERAR DOCUMENTOS Y SUBIRLOS A DRIVE
        const documentos =await GenerarIncidenciasBecarios(req.body);
        // RESPUESTA
        return res.status(200).json({
            mensaje:"Formato de incidencias para becarios generado y guardado correctamente en Google Drive.",
            documentoWord:path.basename(documentos.docx),
            documentoPDF:path.basename(documentos.pdf),
            driveFolderId:documentos.driveFolderId,
            driveWord:documentos.driveWord,
            drivePDF:documentos.drivePDF
        });
    } catch (error) {
        console.error("ERROR EN CONTROLLER DE INCIDENCIAS DE BECARIOS");
        console.error(error);
        return res.status(500).json({
            mensaje:"Error al generar y guardar el formato de incidencias de becarios.",
            error:error.message
        });
    }
}
module.exports = {
    GenerarIncidenciasBecariosController
};