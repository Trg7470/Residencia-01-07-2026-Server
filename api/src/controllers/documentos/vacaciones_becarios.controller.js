const { GenerarVacacionesBecarios, EliminarTemporalesVacaciones } = require("../../services/documentos/vacaciones_becarios.service");
const VacacionesBecarios = require("../../models/vacaciones_becarios.model");

async function GenerarVacacionesBecariosController(req, res) {
    try {
        console.log("SOLICITUD PARA GENERAR VACACIONES DE BECARIO");
        console.log("Body recibido:", req.body);

        if (!req.body) {
            return res.status(400).json({
                mensaje: "No se recibieron datos para generar el formato."
            });
        }

        // VALIDAR ID DEL EXPEDIENTE
        if (!req.body.expedienteId) {
            return res.status(400).json({
                mensaje: "No se recibió el identificador del expediente."
            });
        }

        // VALIDAR DATOS DE VACACIONES
        if (!req.body.Periodo) {
            return res.status(400).json({
                mensaje: "No se recibió el periodo de vacaciones."
            });
        }

        if (!req.body.Cantidad_Dias) {
            return res.status(400).json({
                mensaje: "No se recibió la cantidad de días solicitados."
            });
        }

        if (!req.body.Periodo_De) {
            return res.status(400).json({
                mensaje: "No se recibió la fecha de inicio de vacaciones."
            });
        }

        // VALIDAR GOOGLE DRIVE
        if (!req.body.Drive_Folder_Id) {
            return res.status(400).json({
                mensaje: "No se recibió la carpeta de Google Drive del expediente."
            });
        }

        // GENERAR DOCUMENTOS, SUBIR PDF Y REGISTRAR EN MYSQL
        const documentos = await GenerarVacacionesBecarios(req.body);

        // RESPUESTA
        return res.status(200).json({
            mensaje: "Solicitud de vacaciones generada y registrada correctamente.",
            documentoWord: documentos.documentoWord,
            documentoPDF: documentos.documentoPDF,
            archivoWordTemporal: documentos.archivoWordTemporal,
            archivoPDFTemporal: documentos.archivoPDFTemporal,
            Drive_File_Id: documentos.Drive_File_Id,
            Mime_Type: documentos.Mime_Type,
            Tamano: documentos.Tamano,
            Id_Documento: documentos.Id_Documento,
            Periodo: documentos.Periodo,
            Cantidad_Dias: documentos.Cantidad_Dias,
            diasUtilizados: documentos.diasUtilizados,
            diasDisponibles: documentos.diasDisponibles,
            periodo2Disponible: documentos.periodo2Disponible
        });

    } catch (error) {
        console.error("ERROR EN CONTROLLER DE VACACIONES DE BECARIOS");
        console.error(error);

        return res.status(500).json({
            mensaje: error.message ||
                "Error al generar y registrar el formato de vacaciones de becarios."
        });
    }
}

// CONSULTAR DISPONIBILIDAD DE VACACIONES
async function ObtenerDisponibilidadVacacionesBecariosController(req, res) {
    try {
        const Id_Carpeta = Number(req.params.Id_Carpeta);
        const Anio = Number(req.query.anio || new Date().getFullYear());

        if (!Number.isInteger(Id_Carpeta) || Id_Carpeta <= 0) {
            return res.status(400).json({
                mensaje: "El identificador del expediente no es válido."
            });
        }

        if (!Number.isInteger(Anio) || Anio < 2000 || Anio > 2100) {
            return res.status(400).json({
                mensaje: "El año de vacaciones no es válido."
            });
        }

        // Obtener días utilizados del año solicitado
        const diasUtilizadosPeriodo1 =
            await VacacionesBecarios.obtenerDiasUtilizados(
                Id_Carpeta, 1, Anio
            );

        const diasUtilizadosPeriodo2 =
            await VacacionesBecarios.obtenerDiasUtilizados(
                Id_Carpeta, 2, Anio
            );

        // Obtener días disponibles del año solicitado
        const diasDisponiblesPeriodo1 =
            await VacacionesBecarios.obtenerDiasDisponibles(
                Id_Carpeta, 1, Anio
            );

        const diasDisponiblesPeriodo2 =
            await VacacionesBecarios.obtenerDiasDisponibles(
                Id_Carpeta, 2, Anio
            );

        // El segundo periodo se habilita al completar los 10 días del primero
        const periodo2Disponible = diasUtilizadosPeriodo1 === 10;

        return res.status(200).json({
            anio: Anio,
            diasUtilizadosPeriodo1,
            diasDisponiblesPeriodo1,
            diasUtilizadosPeriodo2,
            diasDisponiblesPeriodo2,
            periodo2Disponible
        });

    } catch (error) {
        console.error("ERROR AL CONSULTAR LA DISPONIBILIDAD DE VACACIONES");
        console.error(error);

        return res.status(500).json({
            mensaje: "No fue posible consultar los días disponibles de vacaciones."
        });
    }
}

// ELIMINAR LOS ARCHIVOS TEMPORALES
async function EliminarTemporalesVacacionesController(req, res) {
    try {
        const resultado = await EliminarTemporalesVacaciones(req.body);

        return res.status(200).json({
            mensaje: resultado.mensaje
        });

    } catch (error) {
        console.error("ERROR AL ELIMINAR LOS ARCHIVOS TEMPORALES DE VACACIONES");
        console.error(error);

        return res.status(500).json({
            mensaje: "Las vacaciones se registraron, pero no fue posible eliminar los archivos temporales.",
            error: error.message
        });
    }
}

module.exports = { GenerarVacacionesBecariosController, EliminarTemporalesVacacionesController, ObtenerDisponibilidadVacacionesBecariosController };