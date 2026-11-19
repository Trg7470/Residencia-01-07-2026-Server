const Expedientes = require("../../../models/expedientes.model");

function FormatearFecha(fecha) {
    if (!fecha) return "";

    const fechaObj = new Date(fecha);

    const dia = fechaObj.getDate();
    const mes = fechaObj.toLocaleDateString("es-MX", {
        month: "long"
    });
    const anio = fechaObj.getFullYear();

    return `${dia} de ${mes.charAt(0).toUpperCase() + mes.slice(1)} del ${anio}`;
}

async function ObtenerDatosCartaConfidencialidad(datosFormulario) {
    const expediente = await Expedientes.obtener_general(
        datosFormulario.Id_Carpeta
    );

    if (!expediente) {
        throw new Error("No se encontró información del expediente.");
    }

    const fechaRecibida = datosFormulario.Fecha_Actual;

    if (!fechaRecibida || !/^\d{4}-\d{2}-\d{2}$/.test(fechaRecibida)) {
        throw new Error("La fecha de la carta es obligatoria y debe ser válida.");
    }

    const [anio, mes, dia] = fechaRecibida.split("-").map(Number);
    const fechaObj = new Date(anio, mes - 1, dia);

    if (
        fechaObj.getFullYear() !== anio ||
        fechaObj.getMonth() !== mes - 1 ||
        fechaObj.getDate() !== dia
    ) {
        throw new Error("La fecha de la carta no es válida.");
    }

    if (!datosFormulario.Puesto || !datosFormulario.Puesto.trim()) {
        throw new Error("El puesto es obligatorio.");
    }

    return {
        Nombre: expediente.Nombre_Completo.toUpperCase(),
        Fecha_Actual: FormatearFecha(fechaObj),
        Puesto: datosFormulario.Puesto.trim().toUpperCase(),
        Apellido_Paterno: expediente.Apellido_Paterno,
        Apellido_Materno: expediente.Apellido_Materno,
        Drive_Folder_Id: expediente.Drive_Folder_Id
    };
}

module.exports = { ObtenerDatosCartaConfidencialidad };