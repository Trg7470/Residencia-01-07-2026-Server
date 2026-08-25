const { ObtenerPlantilla } = require("./encontrarPlantilla.service");
const { GenerarDocumento } = require("./generarDocumento.service");
const { ReemplazarFotoFicha } = require("./imagen/reemplazarFotoFicha.service");
const { GenerarPDF } = require("./generarPDF.service");

async function GenerarFicha(data, archivoFoto) {
    // Obtener plantilla
    const plantillaFicha = await ObtenerPlantilla(
        "Formato_Ficha_Identificacion"
    );

    // Generar documento
    const rutaDocumento = await GenerarDocumento(
        plantillaFicha,
        data,
        `Ficha_Identificacion_${data.Apellido_Pat}_${data.Apellido_Mat}`
    );

    // Extraer la ruta física del archivo subido por Multer
    const rutaFisicaFoto = typeof archivoFoto === "object" && archivoFoto !== null 
        ? archivoFoto.path 
        : archivoFoto;

    console.log("Ruta extraída para la foto:", rutaFisicaFoto);

    // Reemplazar fotografía recibida pasándole la ruta como string
    await ReemplazarFotoFicha(
        rutaDocumento,
        rutaFisicaFoto
    );

    // Generar PDF
    const rutaPDF = await GenerarPDF(
        rutaDocumento,
        `Ficha_Identificacion_${data.Apellido_Pat}_${data.Apellido_Mat}`
    );

    return {
        docx: rutaDocumento,
        pdf: rutaPDF
    };
}

module.exports = { GenerarFicha };