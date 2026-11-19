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
            `INSERT INTO Beneficiarios
            (Nombre, Edad, Parentesco, Id_Persona_Beneficiario) 
            VALUES (?,?,?,?)`,
            [Nombre, Edad, Parentesco, Id_Persona_Beneficiario]
        );
        return result
    }

    // CONSULTAR BENEFICIARIOS POR EXPEDIENTE
    static async consultarPorCarpeta(Id_Carpeta) {
        const [result] = await mysqlPool.query(
            `SELECT
                b.Id_Beneficiario,
                b.Nombre,
                b.Edad,
                b.Parentesco,
                b.Id_Persona_Beneficiario,
                cd.Drive_Folder_Id
            FROM carpetas_drive cd
            INNER JOIN adscripciones a
                ON a.Id_Adscripcion = cd.Id_Adscripcion
            INNER JOIN beneficiarios b
                ON b.Id_Persona_Beneficiario = a.Id_Persona_Adscripcion
            WHERE cd.Id_Carpeta = ?
            ORDER BY b.Id_Beneficiario ASC`,
            [Id_Carpeta]
        );

        return result;
    }
}

module.exports = Beneficiarios;