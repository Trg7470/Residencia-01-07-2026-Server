const fs = require("fs");
const path = require("path");
const RUTAS = require("../../../config/rutas");
const { GenerarHTML } = require("../frente/generarFrente.service");
const { GenerarHTMLAtras } = require("../atras/generarAtras.service");

async function GenerarVista(){

    const rutaHTML = path.join(__dirname,"templates","gafete.html");

    let html = fs.readFileSync(rutaHTML,"utf8");

    const rutaCSS = path.join(__dirname,"css","vistaGafete.css");

    const css = fs.readFileSync(rutaCSS,"utf8");

    html = html.replace("{{ESTILOS}}",`<style>${css}</style>`);

    const frente = await GenerarHTML();

    const atras = await GenerarHTMLAtras();

    html = html.replace("{{FRENTE}}",frente);

    html = html.replace("{{ATRAS}}", atras);

    await fs.promises.mkdir(RUTAS.temporalesGafete,
    { recursive: true }
    );

    const rutaArchivo = path.join(RUTAS.temporalesGafete,"Vista_Gafete.html");

    await fs.promises.writeFile(rutaArchivo,html,"utf8");

    return html;

}

module.exports = {GenerarVista};