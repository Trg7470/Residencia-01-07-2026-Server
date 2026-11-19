const { mysqlPool } = require('../config/mysql');

class Expedientes {
    static async listar() {
        const [resultado] = await mysqlPool.query(`
        SELECT *
        FROM vw_expedientes
        ORDER BY Nombre_Completo ASC
    `);

        return resultado;
    }

    static async obtener_general(id_carpeta) {
        const [resultado] = await mysqlPool.query(`
        SELECT *
        FROM vw_informacion_general_expediente
        WHERE Id_Carpeta = ?
    `, [id_carpeta]);

        return resultado[0];
    }

    static async obtener_unidad_por_nombre(nombre){
        const [resultado] = await mysqlPool.query(`
            SELECT
            Id_Unidad,
            Area,
            Municipio,
            CLUES,
            Nombre
            FROM unidades WHERE Nombre = ? `, [nombre]);

            return resultado[0];
    }

    static async obtener_datos_escolares(id_persona){
        const [resultado] = await mysqlPool.query(`
            SELECT
                c.Nombre AS Carrera,
                e.Nombre AS Universidad,
                a.Tipo_Plaza
            FROM datos_escolares de
            INNER JOIN carreras c
                ON de.Id_Carrera_D_Escolar = c.Id_Carrera
            INNER JOIN escuelas e
                ON de.Id_Escuela_D_Escolar = e.Id_Escuela
            INNER JOIN adscripciones a
                ON a.Id_Persona_Adscripcion = de.Id_Persona_D_Escolar
            WHERE de.Id_Persona_D_Escolar = ?;
            `, [id_persona]
        );
        return resultado[0];
    }

    static async bloquear_expediente(id_carpeta, connection) {
        const [resultado] = await connection.query(
            ` 
                SELECT Id_Carpeta
                FROM carpetas_drive
                WHERE Id_Carpeta = ?
                FOR UPDATE
            `, [id_carpeta]
        );
        return resultado[0];
    }
}

module.exports = Expedientes;