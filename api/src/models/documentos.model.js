const { mysqlPool } = require('../config/mysql');

class Documentos {
    // Registrar un nuevo documento
    static async crear(datos) {
        const {
            Nombre,
            Drive_File_Id,
            Mime_Type,
            Tamano,
            Fecha_Subida,
            Subido_Por_Usuario,
            Id_Carpeta_Documento,
            Id_Tipo_Doc_D
        } = datos;

        const query = `
            INSERT INTO Documentos 
            (Nombre, Drive_File_Id, Mime_Type, Tamano, Fecha_Subida, Subido_Por_Usuario, Id_Carpeta_Documento, Id_Tipo_Doc_D)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const [resultado] = await mysqlPool.query(query, [
            Nombre,
            Drive_File_Id,
            Mime_Type || 'application/pdf',
            Tamano || 0,
            Fecha_Subida || new Date(),
            Subido_Por_Usuario,
            Id_Carpeta_Documento,
            Id_Tipo_Doc_D
        ]);

        return resultado;
    }

    // Obtener un documento por ID
    static async obtenerPorId(id) {
        const query = 'SELECT * FROM Documentos WHERE Id_Documento = ?';
        const [filas] = await mysqlPool.query(query, [id]);
        return filas[0];
    }

    // Listar todos los documentos de una carpeta específica
    static async obtenerPorCarpeta(idCarpeta) {
        const query = 'SELECT * FROM Documentos WHERE Id_Carpeta_Documento = ?';
        const [filas] = await mysqlPool.query(query, [idCarpeta]);
        return filas;
    }

    // Eliminar documento por ID
    static async eliminar(id) {
        const query = 'DELETE FROM Documentos WHERE Id_Documento = ?';
        const [resultado] = await mysqlPool.query(query, [id]);
        return resultado;
    }

    static async contar()
    {
        const [rows] = await mysqlPool.query('SELECT COUNT(*) AS Total FROM Documentos');
        return rows[0].Total;
    }
}

module.exports = Documentos;