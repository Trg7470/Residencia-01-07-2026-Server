const { ObtenerPlantilla } = require("./encontrarPlantilla.service");
const { GenerarDocumento } = require("./generarDocumento.service");
const { GenerarPDF } = require("./generarPDF.service");
const { ObtenerDatosVacacionesBecarios } = require("./datos/vacaciones_becarios.datos");

async function GenerarVacacionesBecarios(datos) {
    // Obtener plantilla
    const plantilla = ObtenerPlantilla("Formato_Vacaciones_Becarios");

    console.log("Datos para vacaciones becarios:", datos);

    // Nombre del archivo
    const fechaSolicitud = new Date().toLocaleDateString("es-MX", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    }).replace(/\//g, "-");
    const nombreArchivo = `Vacaciones_Becarios_${datos.Apellido_Paterno}_${datos.Apellido_Materno}_${fechaSolicitud}`;

    console.log("Nombre del archivo:", nombreArchivo);

    // Generar documento Word
    const rutaDocumento = await GenerarDocumento(
        plantilla,
        datos,
        nombreArchivo
    );

    // Generar PDF
    const rutaPDF = await GenerarPDF(
        rutaDocumento,
        nombreArchivo
    );

    return {
        docx: rutaDocumento,
        pdf: rutaPDF
    };
}

module.exports = {
    GenerarVacacionesBecarios
};