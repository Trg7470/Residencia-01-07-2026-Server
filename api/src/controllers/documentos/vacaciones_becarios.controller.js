const path = require("path");
const { GenerarVacacionesBecarios } = require("../../services/documentos/vacaciones_becarios.service");

async function GenerarVacacionesBecariosController(req, res) {

    try {
        const documentos = await GenerarVacacionesBecarios();

        res.status(200).json({
            mensaje: "Formato de vacaciones para becarios generado correctamente.",
            documentoWord: path.basename(documentos.docx),
            documentoPDF: path.basename(documentos.pdf)
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: "Error al generar el formato de vacaciones de becarios."
        });
    }
}

module.exports = {GenerarVacacionesBecariosController};