const path = require("path");
const RUTAS = require("../../../../config/rutas");

function ObtenerDatosGafete(){

    return{

        Foto: path.join(RUTAS.fotos,"Foto_Prueba.jpeg"),

        Nombre:"E.P.S.S. ILEANA SARAI HURTADO FLORES",

        Adscripcion:"PROMOCIÓN A LA SALUD JSN2",

        Escuela:"ESC. ENFERMERÍA BENITO JUÁREZ,\nGÓMEZ PALACIO, DGO.",

        Vigencia:"01 AGOSTO 2026 AL 31 JULIO 2027",

        Carrera: "ENFERMERIA",

        Encargado: "DR. ISRAEL GRADO MOLINA",

        Ocupacion: "JEFE DE ENSEÑANZA"

    };
}

module.exports = {ObtenerDatosGafete};