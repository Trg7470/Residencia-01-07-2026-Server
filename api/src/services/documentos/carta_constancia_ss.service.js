const { ObtenerPlantilla } = require("./encontrarPlantilla.service");
const { ObtenerDatosConstanciaSS } = require("./datos/carta_constancia_ss.datos");
const { GenerarDocumento } = require("./generarDocumento.service");
const { GenerarPDF } = require("./generarPDF.service");

async function GenerarCartaConstanciaSS(){
    // Obtener plantilla
    const plantilla = ObtenerPlantilla("Formato_Constancia_Servicio_Social");

    // Obtener datos
    const datos = ObtenerDatosConstanciaSS();

    // Generar documento y PDF
    const rutaDocumento = await GenerarDocumento(plantilla, datos ,"Constancia_Servicio_Social_Generada");
    const rutaPDF = await GenerarPDF(rutaDocumento,"Constancia_Servicio_Social_Generada");

    return {
        docx: rutaDocumento,
        pdf: rutaPDF
    };
}

module.exports = {GenerarCartaConstanciaSS};