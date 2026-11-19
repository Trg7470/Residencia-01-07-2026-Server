const { mysqlPool } = require('../config/mysql');

class DatosEscolares
{
    static async guardar(data, connection)
    {
        const {Promedio, Cuenta_NSS, Numero_Afiliacion, Id_Escuela_D_Escolar, Id_Carrera_D_Escolar, Id_Persona_D_Escolar} = data;
        const [result] = await connection.query(
            `INSERT INTO Datos_Escolares(Promedio, Cuenta_NSS, Numero_Afiliacion, Id_Escuela_D_Escolar, Id_Carrera_D_Escolar, Id_Persona_D_Escolar)
            VALUES(?,?,?,?,?,?)`,
            [Promedio, Cuenta_NSS, Numero_Afiliacion, Id_Escuela_D_Escolar, Id_Carrera_D_Escolar, Id_Persona_D_Escolar]
        );
        return result;
    }

    static async obtenerPorPersona(idPersona)
    {
        const [rows] = await mysqlPool.query(
            `SELECT dp.Nombre, 
            dp.Apellido_Paterno, 
            dp.Apellido_Materno, 
            c.Nombre AS Carrera, 
            u.Nombre AS Adscripcion 
            FROM Datos_Personales dp
            LEFT JOIN Datos_Escolares de
            ON de.Id_Persona_D_Escolar = dp.Id_Persona
            LEFT JOIN Carreras c
            ON c.Id_Carrera = de.Id_Carrera_D_Escolar
            LEFT JOIN Adscripciones a
            ON a.FK_Id_Persona = dp.Id_Persona
            LEFT JOIN Unidades u
            ON u.Id_Unidad = a.FK_Id_Unidad
            WHERE dp.Id_Persona = ?`,
            [idPersona]
        );
        return rows[0];
    }
}

module.exports = DatosEscolares;