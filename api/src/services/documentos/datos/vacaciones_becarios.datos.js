function ObtenerDatosVacacionesBecarios(datosExpediente = {}) {
    return {
        // Datos que vienen del expediente seleccionado
        Nombre_Becario: (datosExpediente.Nombre_Becario || "").trim().toUpperCase(),
        Carrera: (datosExpediente.Carrera || "").trim().toUpperCase(),
        Promocion: (datosExpediente.Promocion || "").trim().toUpperCase(),
        Adscripcion_SEDE: (datosExpediente.Adscripcion_SEDE || "").trim().toUpperCase(),
        Jornada: (datosExpediente.Jornada || "").trim().toUpperCase(),

        // Datos de la solicitud de vacaciones
        Periodo: datosExpediente.Periodo || "",
        Cantidad_Dias: datosExpediente.Cantidad_Dias || "",
        Periodo_De: datosExpediente.Periodo_De || "",
        Periodo_A: datosExpediente.Periodo_A || "",
        Fecha_Regreso: datosExpediente.Fecha_Regreso || "",

        // Estos campos quedan vacíos por ahora
        Autorizado_Por: "",
        Fecha_Autorizacion: "",
        Firma: ""
    };
}

module.exports = { ObtenerDatosVacacionesBecarios };