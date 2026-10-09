const path = require("path");

const {
    GenerarCartaConstanciaSS
} = require("../../services/documentos/carta_constancia_ss.service");

async function GenerarConstanciaSSController(req, res) {
    try{
        // Recibir datos enviados desde el formulario
        const datos = req.body;
        console.log("Datos recibidos:", datos);

        // Generar documentos usando los datos del formulario
        const documentos = await GenerarCartaConstanciaSS(datos);
        res.status(200).json({
            mensaje: "Constancia de Servicio Social generada correctamente.",
            documentoPDF: documentos.documentoPDF,
            Drive_File_Id: documentos.Drive_File_Id,
            MimeType: documentos.MimeType,
            Tamano: documentos.Tamano
        });
    } catch(error){
        console.error("Error al generar la constancia:", error);
        res.status(500).json({
            mensaje: "Error al generar la Constancia de Servicio Social."
        });
    }
}

module.exports = { GenerarConstanciaSSController };