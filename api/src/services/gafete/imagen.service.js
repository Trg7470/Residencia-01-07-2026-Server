const fs = require("fs");

function ImagenBase64(ruta){

    const imagen = fs.readFileSync(ruta);

    const extension = ruta.split(".").pop();

    return `data:image/${extension};base64,${imagen.toString("base64")}`;

}


module.exports = {
    ImagenBase64
};