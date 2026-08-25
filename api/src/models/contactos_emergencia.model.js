const { mysqlPool } = require('../config/mysql');

class ContactosEmergencia
{
    static async guardar(data)
    {
        const {Nombre, Parentesco, Telefono, Id_Persona_Contacto} = data;
        const [result] = await mysqlPool.query(`
            INSERT INTO Contactos_Emergencia(Nombre, Parentesco, Telefono, Id_Persona_Contacto)
            VALUES(?,?,?,?)`,
            [Nombre, Parentesco, Telefono, Id_Persona_Contacto]
        );
        return result;
    }
}

module.exports = ContactosEmergencia;