const { mysqlPool } = require('../config/mysql')

class Adscripciones {
    static async guardar(data, connection = mysqlPool) {
        const {
            Fecha_Inicio,
            Fecha_Termino,
            CIFRHS,
            Tipo_Plaza,
            Id_Persona_Adscripcion,
            Id_Unidad_Adscripcion,
            Id_Tipo_Personal_Ad,
            Tipo_Adscripcion = 'Principal'
        } = data;

        const [result] = await connection.query(
            `INSERT INTO Adscripciones (
                Fecha_Inicio,
                Fecha_Termino,
                CIFRHS,
                Tipo_Plaza,
                Id_Persona_Adscripcion,
                Id_Unidad_Adscripcion,
                Id_Tipo_Personal_Ad,
                Tipo_Adscripcion
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                Fecha_Inicio,
                Fecha_Termino,
                CIFRHS,
                Tipo_Plaza,
                Id_Persona_Adscripcion,
                Id_Unidad_Adscripcion,
                Id_Tipo_Personal_Ad,
                Tipo_Adscripcion
            ]
        );

        return result;
    }

    static async listar_comisiones(id_persona) {
        const [resultado] = await mysqlPool.query(`
            SELECT
                a.Id_Adscripcion,
                a.Fecha_Inicio,
                a.Fecha_Termino,
                a.Id_Unidad_Adscripcion,
                u.Nombre AS Nombre_Unidad
            FROM Adscripciones a
            INNER JOIN Unidades u
            ON a.Id_Unidad_Adscripcion = u.Id_Unidad
            WHERE a.Id_Persona_Adscripcion = ?
            AND a.Tipo_Adscripcion = 'Comision'
            ORDER BY a.Fecha_Inicio DESC
            `, [id_persona]);
        return resultado;
    }

    static async obtener_cifrhs_principal(id_persona) {
        const [resultado] = await mysqlPool.query(`
            SELECT
                CIFRHS,
                Tipo_Plaza,
                Id_Tipo_Personal_Ad
            FROM Adscripciones
            WHERE Id_Persona_Adscripcion = ?
            AND Tipo_Adscripcion = 'Principal'
            LIMIT 1
        `, [id_persona]);

        return resultado[0] || null;
    }

    static async verificar_comision_existente(
        id_persona,
        fecha_inicio,
        fecha_termino,
        connection = mysqlPool
    ) {
        const [resultado] = await connection.query(`
            SELECT Id_Adscripcion
            FROM Adscripciones
            WHERE Id_Persona_Adscripcion = ?
            AND Tipo_Adscripcion = 'Comision'
            AND Fecha_Inicio <= ?
            AND Fecha_Termino >= ?
            LIMIT 1
        `, [
            id_persona,
            fecha_termino,
            fecha_inicio
        ]);

        return resultado.length > 0;
    }
}

module.exports = Adscripciones;