const fs = require("fs");
const JSZip = require("jszip");

async function ReemplazarFotoFicha(rutaDocumento, rutaNuevaFoto) {

    // Leer el documento generado
    const archivo = fs.readFileSync(rutaDocumento);

    // Abrir el DOCX
    const zip = await JSZip.loadAsync(archivo);

    // Validar que exista la imagen dentro de la plantilla
    const imagen = zip.file("word/media/image1.jpeg");

    if (!imagen) {
        throw new Error(
            "No se encontró la imagen de la fotografía dentro del documento."
        );
    }

    // Reemplazar fotografía del residente
    zip.file("word/media/image1.jpeg",fs.readFileSync(rutaNuevaFoto));

    // Generar nuevamente el documento
    const nuevoDocumento = await zip.generateAsync({
        type: "nodebuffer"
    });

    // Sobrescribir documento generado
    fs.writeFileSync(rutaDocumento,nuevoDocumento);

    return rutaDocumento;
}

module.exports = { ReemplazarFotoFicha };