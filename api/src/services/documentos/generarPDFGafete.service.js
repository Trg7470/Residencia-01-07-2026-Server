const fs = require("fs").promises;
const path = require("path");
const puppeteer = require("puppeteer");
const RUTAS = require("../../config/rutas");

async function GenerarPDFGafete(html, nombreDocumento) {
    let navegador;

    try {
        // Crear carpeta temporal de PDF si no existe
        await fs.mkdir(RUTAS.temporalesPdf, {
            recursive: true
        });

        // Iniciar navegador
        navegador = await puppeteer.launch({
            headless: true
        });

        const pagina = await navegador.newPage();

        // Configurar tamaño de pagina
        await pagina.setViewport({
            width: 794,
            height: 1123,
            deviceScaleFactor: 2
        });

        // Cargar html del gafete
        await pagina.setContent(html, {
            waitUntil: "networkidle0"
        });

        // Esperar a que las imagenes esten cargadas
        await pagina.evaluate(async () => {
            await Promise.all(
                Array.from(document.images).map(imagen => {
                    if (imagen.complete) {
                        return Promise.resolve();
                    }

                    return new Promise(resolve => {
                        imagen.onload = resolve;
                        imagen.onerror = resolve;
                    });
                })
            );
        });

        // Ruta del pdf
        const rutaPDF = path.join(
            RUTAS.temporalesPdf,
            `${nombreDocumento}.pdf`
        );

        // Generar pdf
        await pagina.pdf({
            path: rutaPDF,
            printBackground: true,
            preferCSSPageSize: true
        });

        return rutaPDF;

    } catch (error) {
        console.error("Error al generar PDF del gafete:", error);
        throw new error;
    } finally {
        if (navegador) {
            await navegador.close();
        }
    }
}

module.exports = { GenerarPDFGafete };