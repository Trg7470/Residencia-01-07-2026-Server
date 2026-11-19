const { ObtenerPlantilla } = require("./encontrarPlantilla.service");
const { GenerarDocumento } = require("./generarDocumento.service");
const { ReemplazarFotoFicha } = require("./imagen/reemplazarFotoFicha.service");
const { GenerarPDF } = require("./generarPDF.service");
const fs = require("fs").promises;
const path = require("path");
const RUTAS = require("../../config/rutas");

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

    try {
        await ReemplazarFotoFicha(
            rutaDocumento,
            rutaFisicaFoto
        );
    } finally {
        if (rutaFisicaFoto) {
            await fs.unlink(rutaFisicaFoto).catch(error => {
                if (error.code !== "ENOENT") {
                    console.error("Error eliminando fotografía temporal:", error);
                }
            });
        }
    }

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

// LIMPIAR DOCUMENTOS TEMPORALES
async function LimpiarFicha(archivoWordTemporal, archivoPDFTemporal) {

    console.log("Archivos recibidos para limpieza:", {
        archivoWordTemporal,
        archivoPDFTemporal,
        carpetaWord: RUTAS.temporalesDocx,
        carpetaPDF: RUTAS.temporalesPdf
    });

    const archivos = [
        { nombre: archivoWordTemporal, carpeta: RUTAS.temporalesDocx, extension: ".docx" },
        { nombre: archivoPDFTemporal, carpeta: RUTAS.temporalesPdf, extension: ".pdf" }
    ];

    for (const archivo of archivos) {
        if (!archivo.nombre) continue;

        const nombre = path.basename(archivo.nombre);

        if (
            nombre !== archivo.nombre ||
            path.extname(nombre).toLowerCase() !== archivo.extension
        ) {
            continue;
        }

        try {
            await fs.unlink(path.join(archivo.carpeta, nombre));
            console.log("Archivo temporal eliminado:", nombre);
        } catch (error) {
            if (error.code !== "ENOENT") {
                console.error("Error eliminando archivo temporal:", error);
            }
        }
    }
}

module.exports = { GenerarFicha, LimpiarFicha };