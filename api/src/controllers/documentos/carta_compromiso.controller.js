const { ObtenerDatosCartaCompromiso, ObtenerTipoParticipacion } = require("../../services/documentos/datos/carta_compromiso.datos");
const { GenerarCartaCompromiso, EliminarTemporalesCartaCompromiso } = require("../../services/documentos/carta_compromiso.service");

// Generar Carta Compromiso
async function GenerarCartaCompromisoController(req, res) {
    try {
        const datosFormulario = req.body;

        // Validar identificador del expediente
        if (!datosFormulario.Id_Carpeta) {
            return res.status(400).json({
                mensaje: "No se recibió el identificador del expediente."
            });
        }

        // Obtener y preparar los datos
        const datos = await ObtenerDatosCartaCompromiso(
            datosFormulario
        );

        // Generar documentos y gestionar Google Drive
        const documentos = await GenerarCartaCompromiso(datos);

        return res.status(200).json({
            mensaje: "Carta compromiso generada correctamente.",
            documentoPDF: documentos.documentoPDF,
            Drive_File_Id: documentos.Drive_File_Id,
            MimeType: documentos.MimeType,
            Tamano: documentos.Tamano,
            archivoWordTemporal: documentos.archivoWordTemporal,
            archivoPDFTemporal: documentos.archivoPDFTemporal
        });

    } catch (error) {

        console.error(
            "Error al generar la carta compromiso:",
            error
        );

        return res.status(500).json({
            mensaje: error.message || "Error al generar la carta compromiso."
        });
    }
}


// Eliminar archivos temporales
async function EliminarTemporalesCartaCompromisoController(req, res) {
    try {
        const resultado = await EliminarTemporalesCartaCompromiso(
            req.body
        );

        return res.status(200).json(resultado);

    } catch (error) {
        console.error(
            "Error al eliminar los archivos temporales de la carta compromiso:",
            error
        );

        return res.status(500).json({
            mensaje: error.message || "Error al eliminar los archivos temporales."
        });
    }
}

// Obtener tipo de participación
async function ObtenerTipoParticipacionController(req, res) {
    try {
        const { Id_Carpeta } = req.params;
        if (!Id_Carpeta) {
            return res.status(400).json({
                mensaje: "No se recibió el identificador del expediente."
            });
        }

        const participacion = await ObtenerTipoParticipacion(
            Id_Carpeta
        );

        return res.status(200).json({
            Participacion: participacion
        });

    } catch (error) {

        console.error(
            "Error al obtener el tipo de participación:",
            error
        );

        return res.status(500).json({
            mensaje: error.message || "Error al obtener el tipo de participación."
        });
    }
}


module.exports = { GenerarCartaCompromisoController, EliminarTemporalesCartaCompromisoController, ObtenerTipoParticipacionController };