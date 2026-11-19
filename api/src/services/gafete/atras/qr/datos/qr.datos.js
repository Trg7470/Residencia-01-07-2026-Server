function FormatearFecha(fecha) {
    if (!fecha) return "";

    return new Date(fecha).toLocaleDateString("es-MX", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        timeZone: "UTC"
    });
}

function ObtenerDatosQR(expediente) {
    return {
        Nombre: expediente.Nombre_Completo || "",
        Adscripcion: expediente.Adscripcion || "",
        Escuela: expediente.Escuela || "",
        Vigencia: `${FormatearFecha(expediente.Fecha_Inicio)} - ${FormatearFecha(expediente.Fecha_Termino)}`,
        GrupoSanguineo: expediente.grupo_sanguineo || "",
        Contacto: expediente.Nombre_Contacto || "",
        Telefono: expediente.Telefono_Contacto || "",
        Derechohabiencia: expediente.Derechohabiencia || "",
        Afiliacion: expediente.Afiliacion || expediente.Numero_Afiliacion || ""
    };
}

module.exports = { ObtenerDatosQR };