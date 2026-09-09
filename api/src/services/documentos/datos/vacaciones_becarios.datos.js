function ObtenerDatosVacacionesBecarios(datosExpediente = {})
{
    return {
        // Datos que vienen del expediente seleccionado
        Nombre_Becario: datosExpediente.Nombre_Becario || "",
        Carrera: datosExpediente.Carrera || "",
        Promocion: datosExpediente.Promocion || "",
        Adscripcion_SEDE: datosExpediente.Adscripcion_SEDE || "",
        Jornada: datosExpediente.Jornada || "",

        // Datos que el usuario captura en el formulario
        Periodo: datosExpediente.Periodo || "",
        Periodo_De: datosExpediente.Periodo_De || "",
        Periodo_A: datosExpediente.Periodo_A || "",

        // Estos campos quedan vacíos por ahora
        Autorizado_Por: "",
        Fecha_Autorizacion: "",
        Firma: ""
    };
}

module.exports = {
    ObtenerDatosVacacionesBecarios
};