function FormatearFecha(fecha) {
    if (!fecha) return "";
    const [anio, mes, dia] = fecha.split("-");
    return `${dia}-${mes}-${anio}`;
}

function ObtenerDatosIncidenciasBecarios(datosFormulario) {
    return {
        Fecha_Actual: FormatearFecha(datosFormulario.Fecha_Actual),
        Nombre_Becario: (datosFormulario.Nombre_Becario || "").trim().toUpperCase(),
        Promocion: (datosFormulario.Promocion || "").trim().toUpperCase(),
        Carrera: (datosFormulario.Carrera || "").trim().toUpperCase(),
        Adscripcion: (datosFormulario.Adscripcion || "").trim().toUpperCase(),
        Fecha_Solicitada: FormatearFecha(datosFormulario.Fecha_Solicitada),
        Motivo: (datosFormulario.Motivo || "").trim().toUpperCase()
    };
}

module.exports = { ObtenerDatosIncidenciasBecarios };