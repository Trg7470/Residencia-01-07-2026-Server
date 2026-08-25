const { mysqlPool } = require('../config/mysql')

class TiposPersonal
{
    static async all()
    {
         const [result] = await mysqlPool.query(
            `SELECT Id_Tipo_Personal, Nombre FROM Tipos_Personal`
        );
        return result;
    }
}

module.exports = TiposPersonal;