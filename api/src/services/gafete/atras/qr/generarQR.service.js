const QRCode = require("qrcode");
const path = require("path");
const fs = require("fs").promises;
const { ObtenerContenidoQR } = require("./contenidoQR.service");
const RUTAS = require("../../../../config/rutas");

async function GenerarQR(datos) {

    const textoQR = ObtenerContenidoQR(datos);

    await fs.mkdir(RUTAS.temporalesQR,
        { recursive: true }
    );

    const rutaQR = path.join(RUTAS.temporalesQR,`${datos.IdGafete || "QR_Prueba"}.png`);

    await QRCode.toFile(rutaQR, textoQR
    );

    return rutaQR;
}

module.exports = {GenerarQR};