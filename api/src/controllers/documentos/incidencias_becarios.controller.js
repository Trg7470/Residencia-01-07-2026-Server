const path = require("path");
const {GenerarIncidenciasBecarios} = require("../../services/documentos/incidencias_becarios.service");

async function GenerarIncidenciasBecariosController(req, res) {
    try {
        console.log("SOLICITUD PARA GENERAR INCIDENCIA DE BECARIO");
        console.log("Body recibido:",req.body);
        if (!req.body) {
            return res.status(400).json({
                mensaje:"No se recibieron datos para generar el formato."
            });
        }
        // VALIDAR ID DE CARPETA
        if (!req.body.Id_Carpeta) {
            return res.status(400).json({
                mensaje:"No se recibió el Id_Carpeta del expediente."
            });
        }
        // VALIDAR DATOS DE LA INCIDENCIA
        if (!req.body.Fecha_Actual) {
            return res.status(400).json({
                mensaje:"No se recibió la fecha actual."
            });
        }
        if (!req.body.Fecha_Solicitada) {
            return res.status(400).json({
                mensaje:"No se recibió la fecha solicitada."
            });
        }
        if (!req.body.Promocion) {
            return res.status(400).json({
                mensaje:"No se recibió la promoción."
            });
        }
        if (!req.body.Motivo) {
            return res.status(400).json({
                mensaje:"No se recibió el motivo."
            });
        }
        // VALIDAR GOOGLE DRIVE
        if (!req.body.Drive_Folder_Id) {
            return res.status(400).json({
                mensaje:"No se recibió la carpeta de Google Drive del expediente."

            });
        }
        // GENERAR
        const documentos =await GenerarIncidenciasBecarios(req.body);
        // RESPUESTA
        return res.status(200).json({
            mensaje:"Incidencia guardada, documentos generados y PDF subido correctamente a Google Drive.",
            Id_Incidencia:documentos.Id_Incidencia,
            documentoWord:path.basename(documentos.docx),
            documentoPDF:path.basename(documentos.pdf),
            driveFolderId:documentos.driveFolderId,
            drivePDF:documentos.drivePDF
        });
    } catch (error) {
        console.error("ERROR EN CONTROLLER DE INCIDENCIAS DE BECARIOS");
        console.error(error);
        return res.status(500).json({
            mensaje:"Error al guardar y generar el formato de incidencias de becarios.",
            error:error.message
        });
    }
}
module.exports = {GenerarIncidenciasBecariosController};