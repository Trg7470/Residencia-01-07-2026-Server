const { GenerarVista } = require("../../services/gafete/vista/generarVista.service");

async function GenerarGafeteController(req, res) {

    try {
        const html = await GenerarVista();
        res.status(200).json({
            mensaje: "Gafete generado correctamente.",
            html: html
});

    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: "Error al generar el gafete."
        });
    }
}

module.exports = { GenerarGafeteController };