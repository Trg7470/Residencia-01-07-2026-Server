const fs = require("fs");
const path = require("path");
const RUTAS = require("../../../config/rutas");
const { ObtenerDatosQR } = require("./qr/datos/qr.datos");
const { GenerarQR } = require("./qr/generarQR.service");

const { ImagenBase64 } = require("../imagen.service");

async function GenerarHTMLAtras() {

    // Leer plantilla
    const rutaHTML = path.join(
        __dirname,
        "templates",
        "atras.html"
    );

    let html = fs.readFileSync(
        rutaHTML,
        "utf8"
    );

    // Leer CSS
    const rutaCSS = path.join(
        __dirname,
        "css",
        "gafeteAtras.css"
    );

    const css = fs.readFileSync(
        rutaCSS,
        "utf8"
    );

    // Insertar CSS
    html = html.replace(
        "{{ESTILOS}}",
        `<style>${css}</style>`
    );

    // Obtener datos
    const datos = ObtenerDatosQR();

    // Banner
    datos.Banner = ImagenBase64(
        path.join(
            RUTAS.recursosGafete,
            "banner2.png"
        )
    );

    // Generar QR
    const rutaQR = await GenerarQR(datos);

    // Convertir QR a Base64
    datos.QR = ImagenBase64(rutaQR);

    // Reemplazar todos los datos en el HTML
    Object.keys(datos).forEach((campo) => {

        html = html.replaceAll(
            `{{${campo}}}`,
            datos[campo]
        );

    });

    return html;

    Object.keys(datos).forEach((campo)=>{

    html = html.replaceAll(
        `{{${campo}}}`,
        datos[campo]
    );

});

}

module.exports = {
    GenerarHTMLAtras
};