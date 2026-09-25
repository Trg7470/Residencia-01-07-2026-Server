const Expedientes = require("../../../models/expedientes.model");

function FormatearFecha(fecha){
    if(!fecha) return "";
    const fechaObj = new Date(fecha);
    return fechaObj.toLocaleDateString("es-MX", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    });
}

async function ObtenerDatosConstanciaSS(datosFormulario) {
    // Obtener datos del expediente
    const expediente = await Expedientes.obtener_general(
        datosFormulario.Id_Carpeta
    );

    // Verificar que exista el expediente
    if (!expediente) {
        throw new Error("No se encontró información del expediente.");
    }

    // Obtener informacion de la unidad
    const unidad = await Expedientes.obtener_unidad_por_nombre(
        expediente.Adscripcion
    );

    // Verificar que exista la unidad
    if(!unidad){
        throw new Error(
            "No se encontró información de la unidad correspondiente a la adscripción."
        );
    }

    // Obtener fecha actual
    const fechaActual = new Date().toLocaleDateString("es-MX", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    });

    return {
        // Datos existentes del expediente
        Alumno: expediente.Nombre_Completo,
        Apellido_Paterno: expediente.Apellido_Paterno,
        Apellido_Materno: expediente.Apellido_Materno,
        Drive_Folder_Id: expediente.Drive_Folder_Id,
        
        Abreviatura_Alumno: datosFormulario.Abreviatura_Alumno,
        Universidad: expediente.Escuela,
        Fecha_Inicio: FormatearFecha(expediente.Fecha_Inicio),
        Fecha_Termino: FormatearFecha(expediente.Fecha_Termino),
        Unidad: unidad.Nombre,
        Municipio: unidad.Municipio,
        Estado: "Dgo",

        // Fecha de la constancia
        Fecha_Actual: fechaActual,

        // Datos capturados manualmente
        Conteo: datosFormulario.Conteo.trim(),
        Encargado: datosFormulario.Encargado,
        Abreviatura_Encargado: datosFormulario.Abreviatura_Encargado,
        Ocupacion: datosFormulario.Ocupacion
    };
}

module.exports = { ObtenerDatosConstanciaSS };