const { mysqlPool } = require("../config/mysql.js");


// ============================================================
// OBTENER ID_PERSONA A PARTIR DE LA CARPETA
// ============================================================
async function ObtenerIdPersonaPorCarpeta(Id_Carpeta) {

    const query = `
        SELECT dp.Id_Persona
        FROM carpetas_drive cd

        INNER JOIN adscripciones a
            ON cd.Id_Adscripcion = a.Id_Adscripcion

        INNER JOIN datos_personales dp
            ON a.Id_Persona_Adscripcion = dp.Id_Persona

        WHERE cd.Id_Carpeta = ?

        LIMIT 1
    `;

    const [resultado] = await mysqlPool.execute(
        query,
        [Id_Carpeta]
    );

    if (resultado.length === 0) {
        throw new Error(
            "No se encontró la persona asociada al expediente."
        );
    }

    return resultado[0].Id_Persona;
}


// ============================================================
// GUARDAR INCIDENCIA
// ============================================================
async function CrearIncidenciaBecario(datos) {

    const query = `
        INSERT INTO incidencias_becarios (
            Fecha_Actual,
            Fecha_Solicitada,
            Promocion,
            Motivo,
            Id_Persona_Incidencia
        )
        VALUES (?, ?, ?, ?, ?)
    `;

    const valores = [
        datos.Fecha_Actual,
        datos.Fecha_Solicitada,
        datos.Promocion,
        datos.Motivo,
        datos.Id_Persona_Incidencia
    ];

    const [resultado] = await mysqlPool.execute(query,valores);

    return {
        Id_Incidencia: resultado.insertId
    };
}
module.exports = {ObtenerIdPersonaPorCarpeta,CrearIncidenciaBecario};