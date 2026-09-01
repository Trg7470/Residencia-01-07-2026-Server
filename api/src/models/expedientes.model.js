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
}

module.exports = Expedientes;