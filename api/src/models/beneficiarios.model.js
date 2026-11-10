const { mysqlPool } = require('../config/mysql');

class Beneficiarios
{
    static async guardar(data, connection = mysqlPool)
    {
        const {
            Nombre,
            Edad,
            Parentesco,
            Id_Persona_Beneficiario
        } = data;
        const [result] = await connection.query(
            `INSERT INTO Beneficiarios(Nombre, Edad, Parentesco, Id_Persona_Beneficiario) VALUES
        (?,?,?,?)`,
        [Nombre, Edad, Parentesco, Id_Persona_Beneficiario]
        );
        return result
    }
}

module.exports = Beneficiarios