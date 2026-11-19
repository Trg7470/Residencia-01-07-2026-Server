const Expedientes = require("../../../models/expedientes.model");

function FormatearFecha(fecha) {
    if (!fecha) return "";

    const fechaObj = new Date(fecha);

    return fechaObj.toLocaleDateString("es-MX", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    });
}

function ObtenerParticipacion(tipoPersonal) {
    switch (tipoPersonal) {
        case "Residente":
            return "mi Residencia";
        
        case "Practicante":
            return "mis Prácticas Profesionales";

        case "Pasante":
            return "mis Pasantías";

        case "Servicio Social":
            return "mi Servicio Social";

        default:
            throw new Error("No se pudo determinar el tipo de participación del expediente.");
    }
}

async function ObtenerDatosCartaCompromiso(datosFormulario) {
    // Obtener datos del expediente
    const expediente = await Expedientes.obtener_general(
        datosFormulario.Id_Carpeta
    );

    // Verificar que exista el expediente
    if (!expediente) {
        throw new Error("No se encontró información del expediente.");
    }

    // Determinar el tipo de participación
    const participacion = ObtenerParticipacion(expediente.Tipo_Personal);

    // Obtener fecha seleccionada
    const fechaRecibida = datosFormulario.Fecha_Carta;

    if (!fechaRecibida || !/^\d{4}-\d{2}-\d{2}$/.test(fechaRecibida)) {
        throw new Error("La fecha de la carta es obligatoria y debe ser válida.");
    }

    const [anio, mes, dia] = fechaRecibida.split("-").map(Number);
    const fechaObj = new Date(anio, mes - 1, dia);

    // Verificar que la fecha exista realmente
    if (
        fechaObj.getFullYear() !== anio ||
        fechaObj.getMonth() !== mes - 1 ||
        fechaObj.getDate() !== dia
    ) {
        throw new Error("La fecha de la carta no es válida.");
    }

    const fechaCarta = FormatearFecha(fechaObj);

    // Validar cantidad de semanas
    const cantidadSemanas = Number(datosFormulario.Cantidad_Semanas);

    if(!Number.isInteger(cantidadSemanas) || cantidadSemanas < 1) {
        throw new Error("La cantidad de semanas debe de ser un número entero mayor a cero.");
    }

    return {
        // Datos del expediente
        Nombre: expediente.Nombre_Completo.toUpperCase(),
        Fecha_Carta: fechaCarta,
        Cantidad_Semanas: cantidadSemanas,
        Participacion: participacion,
        Apellido_Paterno: expediente.Apellido_Paterno,
        Apellido_Materno: expediente.Apellido_Materno,
        Drive_Folder_Id: expediente.Drive_Folder_Id
    };
}

async function ObtenerTipoParticipacion(id_carpeta) {
    const expediente = await Expedientes.obtener_general(id_carpeta);

    if (!expediente) {
        throw new Error ("No se encontró información del expediente.");
    }
    return ObtenerParticipacion(expediente.Tipo_Personal);
}

module.exports = { ObtenerDatosCartaCompromiso, ObtenerTipoParticipacion };