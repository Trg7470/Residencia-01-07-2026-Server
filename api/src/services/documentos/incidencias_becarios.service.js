const { ObtenerPlantilla } = require("./encontrarPlantilla.service");
const { ObtenerDatosIncidenciasBecarios } = require("./datos/incidencias_becarios.datos");
const { GenerarDocumento } = require("./generarDocumento.service");
const { GenerarPDF } = require("./generarPDF.service");

async function GenerarIncidenciasBecarios(){
    // Obtener plantilla
    const plantilla = ObtenerPlantilla("Formato_Incidencias_Becarios");

    // Obtener datos
    const datos = ObtenerDatosIncidenciasBecarios();

    // Generar documento y PDF
    const rutaDocumento = await GenerarDocumento(plantilla, datos, "Incidencias_Becarios_Generada");
    const rutaPDF = await GenerarPDF(rutaDocumento, "Incidencias_Becarios_Generada");

    return {
        docx: rutaDocumento,
        pdf: rutaPDF
    };
}

module.exports = {GenerarIncidenciasBecarios};