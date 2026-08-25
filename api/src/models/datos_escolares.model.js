const { mysqlPool } = require('../config/mysql');

class DatosEscolares
{
    static async guardar(data)
    {
        const {Promedio, Cuenta_NSS, Numero_Afiliacion, Id_Escuela_D_Escolar, Id_Carrera_D_Escolar, Id_Persona_D_Escolar} = data;
        const [result] = await mysqlPool.query(
            `INSERT INTO Datos_Escolares(Promedio, Cuenta_NSS, Numero_Afiliacion, Id_Escuela_D_Escolar, Id_Carrera_D_Escolar, Id_Persona_D_Escolar)
            VALUES(?,?,?,?,?,?)`,
            [Promedio, Cuenta_NSS, Numero_Afiliacion, Id_Escuela_D_Escolar, Id_Carrera_D_Escolar, Id_Persona_D_Escolar]
        );
        return result;
    }
}

module.exports = DatosEscolares;