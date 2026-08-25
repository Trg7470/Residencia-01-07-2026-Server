const { mysqlPool } = require('../config/mysql');

class Unidades
{
    static async all()
    {
        const [rows] = await mysqlPool.query(
            'SELECT Id_Unidad, Area, Municipio, CLUES, Nombre FROM Unidades ORDER BY Nombre ASC');
        return rows;
    }
}

module.exports = Unidades;