function FormatearFecha(fecha) {

    if (!fecha) return "";

    const [anio, mes, dia] = fecha.split("-");

    const meses = [
        "enero",
        "febrero",
        "marzo",
        "abril",
        "mayo",
        "junio",
        "julio",
        "agosto",
        "septiembre",
        "octubre",
        "noviembre",
        "diciembre"
    ];

    return `${dia} de ${meses[parseInt(mes) - 1]} del ${anio}`;
}


function FormatearFechaCorta(fecha) {

    if (!fecha) return "";

    const [anio, mes, dia] = fecha.split("-");

    return `${dia}/${mes}/${anio}`;
}

module.exports = {
    FormatearFecha,
    FormatearFechaCorta
};