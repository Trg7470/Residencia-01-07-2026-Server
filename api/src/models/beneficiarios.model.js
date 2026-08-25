const { mysqlPool } = require('../config/mysql');

class Beneficiarios
{
    static async guardar(data)
    {
        const {
            Nombre,
            Edad,
            Parentesco,
            Id_Persona_Beneficiario
        } = data;
        const [result] = await mysqlPool.query(
            `INSERT INTO Beneficiarios(Nombre, Edad, Parentesco, Id_Persona_Beneficiario) VALUES
        (?,?,?,?)`,
        [Nombre, Edad, Parentesco, Id_Persona_Beneficiario]
        );
        return result
    }
}

module.exports = Beneficiarios