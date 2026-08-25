const fs = require("fs");
const path = require("path");
const RUTAS = require("../../../config/rutas");
const { ObtenerDatosGafete } = require("./datos/gafete.datos");
const { ImagenBase64 } = require("../imagen.service");

async function GenerarHTML() {

    // Leer plantilla
    const rutaHTML = path.join(__dirname, "templates", "frente.html");

    let html = fs.readFileSync(rutaHTML, "utf8");


    // Leer CSS
    const rutaCSS = path.join(__dirname, "css", "gafete.css");

    const css = fs.readFileSync(rutaCSS, "utf8");


    // Insertar CSS
    html = html.replace(
        "{{ESTILOS}}",
        `<style>\n${css}\n</style>`
    );


    // Obtener datos
    const datos = ObtenerDatosGafete();

    datos.Logo = ImagenBase64(
        path.join(
            RUTAS.recursosGafete,
            "logoGigante.png"
        )
    );

    datos.Banner = ImagenBase64(path.join(
        RUTAS.recursosGafete,
        "banner2.png"
    )
    );

    datos.Foto = ImagenBase64(
    datos.Foto
);

    // Reemplazar datos
    Object.keys(datos).forEach((campo) => {

        html = html.replaceAll(
            `{{${campo}}}`,
            datos[campo]
        );

    });

    return html;

}

module.exports = {
    GenerarHTML
};