const { ObtenerPlantilla } = require("./encontrarPlantilla.service");
const { ObtenerDatosPresentacion } = require("./datos/carta_presentacion.datos");
const { GenerarDocumento } = require("./generarDocumento.service");
const { GenerarPDF } = require("./generarPDF.service");

async function GenerarCartaPresentacion(){

    // Obtener plantilla
    const plantilla = ObtenerPlantilla("Formato_Presentacion");

    // Obtener datos
    const datos = ObtenerDatosPresentacion();

    // Generar documento
    const rutaDocumento = await GenerarDocumento(plantilla, datos, "Carta_Presentacion_Generada");
    const rutaPDF = await GenerarPDF(rutaDocumento,"Carta_Presentacion_Generada");

    return {
        docx: rutaDocumento,
        pdf: rutaPDF
    };
}

module.exports = { GenerarCartaPresentacion };