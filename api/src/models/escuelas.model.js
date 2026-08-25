const { mysqlPool } = require('../config/mysql');

class Escuelas {
    static async all() {
        const [rows] = await mysqlPool.query(
            'SELECT Id_Escuela, Nombre, Estado, Municipio, Tipo FROM Escuelas ORDER BY Id_Escuela ASC'
        );
        return rows;
    }

    static async tipo_municipio(tipo, municipio) {
        const [rows] = await mysqlPool.query(
            'SELECT Id_Escuela, Nombre, Estado, Municipio, Tipo FROM Escuelas WHERE Tipo = ? AND Municipio = ?',
            [tipo, municipio]
        );
        return rows;
    }
}

module.exports = Escuelas;