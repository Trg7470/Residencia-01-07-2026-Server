function ObtenerDatosCartaAdscripcion(datosFormulario) {
    return {
        Fecha_Inicio: datosFormulario.Fecha_Inicio,
        Nombre_Pasante: (datosFormulario.Nombre_Pasante || "").trim().toUpperCase(),
        Tipo_Personal: (datosFormulario.Tipo_Personal || "").trim().toUpperCase(),
        Tipo_Participacion: (datosFormulario.Tipo_Participacion || "").trim().toUpperCase(),
        Facultad: (datosFormulario.Facultad || "").trim().toUpperCase(),
        Universidad: (datosFormulario.Universidad || "").trim().toUpperCase(),
        Escuela: (datosFormulario.Escuela || "").trim().toUpperCase(),
        Lugar_Adscripcion: (datosFormulario.Lugar_Adscripcion || "").trim().toUpperCase(),
        Tipo_Plaza: (datosFormulario.Tipo_Plaza || "").trim().toUpperCase(),
        Fecha_Termino: datosFormulario.Fecha_Termino,
        Hora_Entrada: datosFormulario.Hora_Entrada,
        Hora_Salida: datosFormulario.Hora_Salida,
        Encargado: (datosFormulario.Encargado || "").trim().toUpperCase()
    };
}

module.exports = { ObtenerDatosCartaAdscripcion };