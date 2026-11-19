const { ObtenerDatosCartaConfidencialidad } = require("../../services/documentos/datos/carta_confidencialidad.datos");
const { GenerarCartaConfidencialidad, EliminarTemporalesCartaConfidencialidad } = require("../../services/documentos/carta_confidencialidad.service");

async function GenerarCartaConfidencialidadController(req, res) {
    try {
        const datosFormulario = req.body;

        if (!datosFormulario.Id_Carpeta) {
            return res.status(400).json({
                mensaje: "No se recibió el identificador del expediente."
            });
        }

        const datos = await ObtenerDatosCartaConfidencialidad(datosFormulario);
        const documentos = await GenerarCartaConfidencialidad(datos);

        return res.status(200).json({
            mensaje: "Carta de confidencialidad generada correctamente.",
            documentoPDF: documentos.documentoPDF,
            Drive_File_Id: documentos.Drive_File_Id,
            MimeType: documentos.MimeType,
            Tamano: documentos.Tamano,
            archivoWordTemporal: documentos.archivoWordTemporal,
            archivoPDFTemporal: documentos.archivoPDFTemporal
        });
    } catch (error) {
        console.error("Error al generar la carta de confidencialidad:", error);
        return res.status(500).json({
            mensaje: error.message || "Error al generar la carta de confidencialidad."
        });
    }
}

async function EliminarTemporalesCartaConfidencialidadController(req, res) {
    try {
        const resultado = await EliminarTemporalesCartaConfidencialidad(req.body);
        return res.status(200).json(resultado);
    } catch (error) {
        console.error("Error al eliminar los archivos temporales de la carta de confidencialidad:", error);
        return res.status(500).json({
            mensaje: error.message || "Error al eliminar los archivos temporales."
        });
    }
}

module.exports = { GenerarCartaConfidencialidadController, EliminarTemporalesCartaConfidencialidadController };