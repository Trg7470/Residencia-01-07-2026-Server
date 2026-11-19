const path = require("path");
const RUTAS = require("../../../../config/rutas");

function FormatearFecha(fecha) {
    if (!fecha) return "";

    const fechaLocal = new Date(fecha);

    return fechaLocal.toLocaleDateString("es-MX", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        timeZone: "UTC"
    }).toUpperCase();
}

function ObtenerDatosGafete(expediente) {
    return {
        Foto: expediente.Fotografia || "",
        Nombre: (expediente.Nombre_Completo || "").trim().toUpperCase(),
        Adscripcion: (expediente.Adscripcion || "").trim().toUpperCase(),
        Escuela: (expediente.Escuela || "").trim().toUpperCase(),
        Vigencia: `${FormatearFecha(expediente.Fecha_Inicio)} AL ${FormatearFecha(expediente.Fecha_Termino)}`,
        Encargado: (expediente.Nombre_Encargado || "").trim().toUpperCase(),
        Ocupacion: (expediente.Cargo_Encargado || "").trim().toUpperCase()
    };
}

module.exports = { ObtenerDatosGafete };