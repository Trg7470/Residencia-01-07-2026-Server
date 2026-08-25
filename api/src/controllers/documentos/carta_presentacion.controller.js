const path = require("path");
const { GenerarCartaPresentacion } = require("../../services/documentos/carta_presentacion.service");

async function GenerarPresentacionController(req, res) {

    try {
        const documentos = await GenerarCartaPresentacion();

        res.status(200).json({
            mensaje: "Carta de presentación generada correctamente.",
            documentoWord: path.basename(documentos.docx),
            documentoPDF: path.basename(documentos.pdf)
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: "Error al generar la carta de presentación."
        });
    }
}

module.exports = {GenerarPresentacionController};