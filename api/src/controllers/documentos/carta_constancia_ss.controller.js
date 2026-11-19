const { GenerarCartaConstanciaSS, EliminarTemporalesConstanciaSS } = require("../../services/documentos/carta_constancia_ss.service");

async function GenerarConstanciaSSController(req, res) {
    try{
        // Recibir datos enviados desde el formulario
        const datos = req.body;
        console.log("Datos recibidos:", datos);

        // Generar documentos usando los datos del formulario
        const documentos = await GenerarCartaConstanciaSS(datos);
        
        return res.status(200).json({
            mensaje: "Constancia de Servicio Social generada correctamente.",
            documentoWord: documentos.documentoWord,
            documentoPDF: documentos.documentoPDF,
            archivoWordTemporal: documentos.archivoWordTemporal,
            archivoPDFTemporal: documentos.archivoPDFTemporal,
            Drive_File_Id: documentos.Drive_File_Id,
            MimeType: documentos.MimeType,
            Tamano: documentos.Tamano,
            dirvePDF: documentos.drivePDF
        });
    } catch(error){
        console.error("Error al generar la constancia:", error);
        return res.status(500).json({
            mensaje: "Error al generar la Constancia de Servicio Social."
        });
    }
}

// Eliminar archivos temporales
async function EliminarTemporalesConstanciaSSController(req, res) {
    try {
        const resultado = await EliminarTemporalesConstanciaSS(req.body);
        return res.status(200).json(resultado);
    } catch (error) {
        console.error("Error al eliminar archivos temporales:", error);
        return res.status(500).json({
            mensaje: error.message || "Error al eliminar los archivos temporales."
        });
    }
}

module.exports = { GenerarConstanciaSSController, EliminarTemporalesConstanciaSSController };