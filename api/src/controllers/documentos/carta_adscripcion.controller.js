const path = require("path");
const { GenerarCartaAdscripcion } = require("../../services/documentos/carta_adscripcion.service");

async function GenerarAdscripcionController(req, res) {

    try {
        const documentos = await GenerarCartaAdscripcion();

        res.status(200).json({
            mensaje: "Carta de adscripción generada correctamente.",
                documentoWord: path.basename(documentos.docx),
                documentoPDF:path.basename(documentos.pdf)
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: "Error al generar la carta de adscripción."
        });
    }
}

module.exports = {GenerarAdscripcionController};