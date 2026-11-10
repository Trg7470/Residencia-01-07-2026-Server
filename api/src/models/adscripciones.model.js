const { mysqlPool } = require('../config/mysql')

class Adscripciones {
    static async guardar(data, connection = mysqlPool) {
        const { Fecha_Inicio, Fecha_Termino, Id_Persona_Adscripcion, Id_Unidad_Adscripcion, Id_Tipo_Personal_Ad } = data;
        const [result] = await connection.query(
            `INSERT INTO Adscripciones(Fecha_Inicio, Fecha_Termino, Id_Persona_Adscripcion, Id_Unidad_Adscripcion, Id_Tipo_Personal_Ad)
            VALUES(?,?,?,?,?)`,
            [Fecha_Inicio, Fecha_Termino, Id_Persona_Adscripcion, Id_Unidad_Adscripcion, Id_Tipo_Personal_Ad]
        );
        return result;
    }
}

module.exports = Adscripciones;