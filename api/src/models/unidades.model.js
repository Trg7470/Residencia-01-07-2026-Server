const { mysqlPool } = require('../config/mysql');

class Unidades
{
    static async all()
    {
        const [rows] = await mysqlPool.query(
            'SELECT Id_Unidad, Area, Municipio, CLUES, Nombre FROM Unidades ORDER BY Nombre ASC'
        );
        return rows;
    }

    static async obtenerPorId(Id_Unidad)
    {
        const [rows] = await mysqlPool.query(
            'SELECT Id_Unidad, Area, Municipio, CLUES, Nombre FROM Unidades WHERE Id_Unidad = ?',
            [Id_Unidad]
        );
        return rows[0];
    }
}

module.exports = Unidades