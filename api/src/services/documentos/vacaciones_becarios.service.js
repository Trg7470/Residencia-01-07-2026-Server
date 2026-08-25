const { ObtenerPlantilla } = require("./encontrarPlantilla.service");
const { ObtenerDatosVacacionesBecarios } = require("./datos/vacaciones_becarios.datos");
const { GenerarDocumento } = require("./generarDocumento.service");
const { GenerarPDF} = require("./generarPDF.service");

async function GenerarVacacionesBecarios(){
    // Obtener plantilla
    const plantilla = ObtenerPlantilla("Formato_Vacaciones_Becarios");

    // Obtener datos
    const datos = ObtenerDatosVacacionesBecarios();

    // Generar documento y PDF
    const rutaDocumento = await GenerarDocumento(plantilla,datos,"Vacaciones_Becarios_Generada");
    const rutaPDF = await GenerarPDF(rutaDocumento,"Vacaciones_Becarios_Generada");

    return {
        docx: rutaDocumento,
        pdf: rutaPDF
    }
}

module.exports = {GenerarVacacionesBecarios};