const path = require("path");
const { GenerarIncidenciasBecarios } = require("../../services/documentos/incidencias_becarios.service");

async function GenerarIncidenciasBecariosController(req, res){
    try{
        const documentos = await GenerarIncidenciasBecarios();

        res.status(200).json({
            mensaje: "Formato de incidencias para becarios generado correctamente.",
            documentoWord: path.basename(documentos.docx),
            documentoPDF : path.basename(documentos.pdf)
        });

    }catch(error){
        console.error(error);
        res.status(500).json({
            mensaje: "Error al generar el formato de incidencias de becarios."
        });
    }
}

module.exports = {GenerarIncidenciasBecariosController};
