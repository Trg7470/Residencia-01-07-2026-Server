const path = require("path");

const RUTAS = {

    // Plantillas Word
    plantillas: path.join(__dirname, "../recursos/plantillas_docx"),
    // Documentos Word temporales
    temporalesDocx: path.join(__dirname, "../../storage/temporales/docx"),
    // Documentos PDF temporales
    temporalesPdf: path.join(__dirname, "../../storage/temporales/pdf"),
    // QR temporales
    temporalesQR: path.join(__dirname, "../../storage/temporales/qr"),
    //Html gafete temporales
    temporalesGafete: path.join(__dirname, "../../storage/temporales/gafete"),
    // Recursos generales
    recursos: path.join(__dirname, "../recursos"),
    // Fotos
    fotos: path.join(__dirname, "../recursos/fotos"),
    //Gafete
    recursosGafete: path.join(__dirname, "../recursos/gafete"),

    //SILABB
    //plantilla constancia liberacion
    plantilla_constancia: path.join(__dirname, "../recursos/plantilla_constancia"),

};

module.exports = RUTAS;