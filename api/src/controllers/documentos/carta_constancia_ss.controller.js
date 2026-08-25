const path = require("path");
const { GenerarCartaConstanciaSS } = require("../../services/documentos/carta_constancia_ss.service");

async function GenerarConstanciaSSController(req, res) {
    try {
        const documentos = await GenerarCartaConstanciaSS();

        res.status(200).json({
            mensaje: "Constancia de Servicio Social generada correctamente.",
            documentoWord: path.basename(documentos.docx),
            documentoPDF: path.basename(documentos.pdf)
        });

    } catch(error) {
        console.error(error);
        res.status(500).json({
            mensaje: "Error al generar la Constancia de Servicio Social."
        });
    }
}

module.exports = {GenerarConstanciaSSController};