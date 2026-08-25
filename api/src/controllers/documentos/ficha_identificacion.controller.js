const path = require("path");
const { GenerarFicha } = require("../../services/documentos/ficha_identificacion.service");

async function GenerarFichaController(req, res) {
    try {
        // Validación defensiva para evitar TypeError si req.body es undefined
        const body = req.body || {};
        
        let datos = {};
        if (body.ficha_data) {
            datos = typeof body.ficha_data === "string" ? JSON.parse(body.ficha_data) : body.ficha_data;
        } else {
            datos = body;
        }

        // Obtener la foto procesada por multer
        const fotoFile = req.file;

        const documentos = await GenerarFicha(datos, fotoFile);

        res.status(200).json({
            mensaje: "Ficha de Identificación generada correctamente.",
            documentoWord: path.basename(documentos.docx),
            documentoPDF: path.basename(documentos.pdf)
        });

    } catch (error) {
        console.error("Error en GenerarFichaController:", error);
        res.status(500).json({
            mensaje: "Error al generar la ficha.",
            error: error.message
        });
    }
}

module.exports = { GenerarFichaController };