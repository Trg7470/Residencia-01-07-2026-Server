function ConvertirMayusculas(texto) {

    if (!texto) return "";

    return texto.toUpperCase();
}


function ConvertirCamposMayusculas(datos, campos) {

    const resultado = { ...datos };

    campos.forEach(function (campo) {

        if (resultado[campo]) {
            resultado[campo] =
                resultado[campo].toUpperCase();
        }

    });

    return resultado;
}


function ObtenerApellidos(nombreCompleto) {

    if (!nombreCompleto) return "";

    const partes = nombreCompleto
        .trim()
        .split(/\s+/);

    if (partes.length < 2) {
        return partes[0];
    }

    const apellidoPaterno =
        partes[partes.length - 2];

    const apellidoMaterno =
        partes[partes.length - 1];

    return `${apellidoPaterno}_${apellidoMaterno}`;
}

// Formatear apellidos para el nombre del archivo
function FormatearNombreArchivo(texto = "") {
    return texto
        .toLowerCase()
        .replace(/(^|[_\s])(\p{L})/gu, (coincidencia, separador, letra) => {
            return separador + letra.toUpperCase();
        }
    );
}

module.exports = {
    ConvertirMayusculas,
    ConvertirCamposMayusculas, 
    ObtenerApellidos, 
    FormatearNombreArchivo
};