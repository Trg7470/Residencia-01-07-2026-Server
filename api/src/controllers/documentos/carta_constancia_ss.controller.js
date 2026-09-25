const path = require("path");

const {
    GenerarCartaConstanciaSS
} = require("../../services/documentos/carta_constancia_ss.service");

async function GenerarConstanciaSSController(req, res) {
    try{
        // Recibir datos enviados desde el formulario
        const datos = req.body;
        console.log("Datos recibidos:", datos);

        // Generar document9os usando los datos del formulario
        const documentos = await GenerarCartaConstanciaSS(datos);
        res.status(200).json({
            mensaje: "Constancia de Servicio Social generada correctamente.",
            documentoWord: path.basename(documentos.docx),
            documentoPDF: path.basename(documentos.pdf)
        });
    } catch(error){
        console.error(error);
        res.status(500).json({
            mensaje: "Error al generar la Constancia de Servicio Social."
        });
    }
}

module.exports = { GenerarConstanciaSSController };