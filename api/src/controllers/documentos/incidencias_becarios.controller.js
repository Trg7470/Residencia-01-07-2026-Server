const path = require("path");
const { mysqlPool } = require("../../config/mysql");
const { CrearIncidenciaBecario } = require("../../models/incidencias_becarios.model");
const { GenerarIncidenciasBecarios, EliminarTemporalesIncidencias } = require("../../services/documentos/incidencias_becarios.service");

async function GenerarIncidenciasBecariosController(req, res) {
    try {
        console.log("SOLICITUD PARA GENERAR INCIDENCIA DE BECARIO");
        console.log("Body recibido:", req.body);

        if (!req.body) {
            return res.status(400).json({
                mensaje: "No se recibieron datos para generar el formato."
            });
        }

        // VALIDAR ID DE CARPETA
        if (!req.body.Id_Carpeta) {
            return res.status(400).json({
                mensaje: "No se recibió el Id_Carpeta del expediente."
            });
        }

        // VALIDAR DATOS DE LA INCIDENCIA
        if (!req.body.Fecha_Actual) {
            return res.status(400).json({
                mensaje: "No se recibió la fecha actual."
            });
        }

        if (!req.body.Fecha_Solicitada) {
            return res.status(400).json({
                mensaje: "No se recibió la fecha solicitada."
            });
        }

        if (!req.body.Promocion) {
            return res.status(400).json({
                mensaje: "No se recibió la promoción."
            });
        }

        if (!req.body.Motivo) {
            return res.status(400).json({
                mensaje: "No se recibió el motivo."
            });
        }

        // VALIDAR GOOGLE DRIVE
        if (!req.body.Drive_Folder_Id) {
            return res.status(400).json({
                mensaje: "No se recibió la carpeta de Google Drive del expediente."
            });
        }

        // OBTENER CONEXIÓN A MYSQL
        const connection = await mysqlPool.getConnection();

        let transaccionIniciada = false;
        let incidencia;
        let documentos;

        try {
            // INICIAR TRANSACCIÓN
            await connection.beginTransaction();
            transaccionIniciada = true;

            // GUARDAR INCIDENCIA EN MYSQL
            incidencia = await CrearIncidenciaBecario(
                req.body,
                connection
            );

            console.log(
                "INCIDENCIA REGISTRADA EN MYSQL:",
                incidencia.Id_Incidencia
            );

            // GENERAR DOCUMENTOS Y SUBIR PDF A DRIVE
            documentos = await GenerarIncidenciasBecarios(req.body);

            // CONFIRMAR TRANSACCIÓN
            await connection.commit();
            transaccionIniciada = false;

        } catch (error) {

            // REVERTIR TRANSACCIÓN SI OCURRE UN ERROR
            if (transaccionIniciada) {
                await connection.rollback();
            }

            throw error;

        } finally {
            // LIBERAR CONEXIÓN
            connection.release();
        }

        // RESPUESTA
        return res.status(200).json({
            mensaje: "Incidencia generada, cargada a Google Drive y registrada correctamente.",
            Id_Incidencia: incidencia.Id_Incidencia,
            documentoWord: path.basename(documentos.docx),
            documentoPDF: documentos.documentoPDF,
            archivoWordTemporal: documentos.archivoWordTemporal,
            archivoPDFTemporal: documentos.archivoPDFTemporal,
            Drive_File_Id: documentos.Drive_File_Id,
            MimeType: documentos.MimeType,
            Tamano: documentos.Tamano,
            drivePDF: documentos.drivePDF
        });

    } catch (error) {
        console.error("ERROR EN CONTROLLER DE INCIDENCIAS DE BECARIOS");
        console.error(error);

        return res.status(500).json({
            mensaje: "Error al guardar y generar el formato de incidencias de becarios.",
            error: error.message
        });
    }
}


// ELIMINAR LOS ARCHIVOS TEMPORALES
async function EliminarTemporalesIncidenciasController(req, res) {
    try {
        const resultado = await EliminarTemporalesIncidencias(req.body);

        return res.status(200).json({
            mensaje: resultado.mensaje
        });

    } catch (error) {
        console.error("ERROR AL ELIMINAR LOS ARCHIVOS TEMPORALES DE INCIDENCIAS");
        console.error(error);

        return res.status(500).json({
            mensaje: "Los documentos se guardaron, pero no fue posible eliminar los archivos temporales.",
            error: error.message
        });
    }
}

module.exports = { GenerarIncidenciasBecariosController, EliminarTemporalesIncidenciasController };