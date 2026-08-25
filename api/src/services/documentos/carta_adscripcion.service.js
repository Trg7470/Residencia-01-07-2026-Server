const { ObtenerPlantilla } = require("./encontrarPlantilla.service");
const { ObtenerDatosAdscripcion } = require("./datos/carta_adscripcion.datos");
const { GenerarDocumento } = require("./generarDocumento.service");
const { GenerarPDF } = require("./generarPDF.service");

async function GenerarCartaAdscripcion() {

    // Obtener plantilla
    const plantilla = ObtenerPlantilla("Formato_Adscripcion");

    // Obtener datos
    const datos = ObtenerDatosAdscripcion();

    // Generar documento y PDF
    const rutaDocumento = await GenerarDocumento(plantilla, datos, "Carta_Adscripcion_Generada");
    const rutaPDF = await GenerarPDF(rutaDocumento, "Carta_Adscripcion_Generada");

    return {
        docx: rutaDocumento,
        pdf: rutaPDF
    }
}

module.exports = { GenerarCartaAdscripcion };