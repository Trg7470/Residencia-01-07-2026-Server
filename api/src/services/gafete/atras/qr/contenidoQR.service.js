function ObtenerContenidoQR(datos){
    return `
══════════════════════════════════════
SERVICIOS DE SALUD DE DURANGO
JURISDICCIÓN SANITARIA No. 2
GAFETE DE IDENTIFICACIÓN OFICIAL
══════════════════════════════════════
ID GAFETE:
${datos.IdGafete}
NOMBRE:
${datos.Nombre}
ADSCRIPCIÓN:
${datos.Adscripcion}
ESCUELA:
${datos.Escuela}
VIGENCIA:
${datos.Vigencia}
GRUPO SANGUÍNEO:
${datos.GrupoSanguineo}
CONTACTO DE EMERGENCIA:
${datos.Contacto}
TELÉFONO:
${datos.Telefono}
DERECHOHABIENCIA:
${datos.Derechohabiencia}
AFILIACIÓN:
${datos.Afiliacion}
══════════════════════════════════════
Este código contiene información del titular
para fines de identificación y atención
en caso de emergencia.
El uso no autorizado de esta información
está prohibido.
Reportes:
Jefatura de Enseñanza
Jurisdicción Sanitaria No. 2
Tel. 871 525 2739
`;
}

module.exports = { ObtenerContenidoQR };