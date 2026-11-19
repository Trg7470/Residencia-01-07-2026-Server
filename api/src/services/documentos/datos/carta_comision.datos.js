function ObtenerDatosCartaComision(datos = {}) {
    return {
        // Datos generales
        Fecha_Carta: datos.Fecha_Carta || "",

        // Destinatario
        Abreviatura_Destinatario: datos.Abreviatura_Destinatario || "",
        Dirigido_A: datos.Dirigido_A || "",
        Ocupacion_Destinatario: datos.Ocupacion_Destinatario || "",

        // Alumno / personal
        Abreviatura_Alumno: datos.Abreviatura_Alumno || "",
        Alumno: datos.Alumno || "",
        Carrera: datos.Carrera || "",
        Escuela: datos.Escuela || "",
        Tipo_Participacion: datos.Tipo_Participacion || "",

        // Adscripciones
        Lugar_Adscripcion: datos.Lugar_Adscripcion || "",
        Lugar_Comision: datos.Lugar_Comision || "",

        // Fechas de comisión
        Fecha_Inicio: datos.Fecha_Inicio || "",
        Fecha_Termino: datos.Fecha_Termino || "",

        // Encargado
        Ocupacion_Encargado: datos.Ocupacion_Encargado || "",
        Abreviatura_Encargado: datos.Abreviatura_Encargado || "",
        Encargado: datos.Encargado || ""
    };
}

module.exports = { ObtenerDatosCartaComision };