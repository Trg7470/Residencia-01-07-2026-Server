const { mysqlPool } = require('../config/mysql');

class Carreras
{
    static async all() {
        const [rows] = await mysqlPool.query(
            'SELECT Id_Carrera, Nombre, Tipo_Carrera FROM Carreras ORDER BY Id_Carrera ASC');
        return rows;
    }
    static async type(tipo) {
        const [rows] = await mysqlPool.query(
            'SELECT Id_Carrera, Nombre, Tipo_Carrera FROM Carreras WHERE Tipo_Carrera = ?', [tipo]);
        return rows;
    }
}

module.exports = Carreras;