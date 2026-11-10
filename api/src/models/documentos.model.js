const { mysqlPool } = require('../config/mysql');

class Documentos {
    static async crear(datos, connection = mysqlPool) {
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
            (
                Nombre,
                Drive_File_Id,
                Mime_Type,
                Tamano,
                Fecha_Subida,
                Subido_Por_Usuario,
                Id_Carpeta_Documento,
                Id_Tipo_Doc_D
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const [resultado] = await connection.query(query, [
            Nombre,
            Drive_File_Id,
            Mime_Type || 'application/pdf',
            Tamano ?? 0,
            Fecha_Subida || new Date(),
            Subido_Por_Usuario,
            Id_Carpeta_Documento,
            Id_Tipo_Doc_D
        ]);

        return resultado;
    }

    static async obtenerPorId(id) {
        const query = 'SELECT * FROM Documentos WHERE Id_Documento = ?';
        const [filas] = await mysqlPool.query(query, [id]);
        return filas[0];
    }

    static async obtener_carpeta(Id_Carpeta) {
        const query = 'SELECT * FROM Documentos WHERE Id_Carpeta_Documento = ?';
        const [rows] = await mysqlPool.query(query, [Id_Carpeta]);
        return rows;
    }

    static async eliminar(id) {
        const query = 'DELETE FROM Documentos WHERE Id_Documento = ?';
        const [resultado] = await mysqlPool.query(query, [id]);
        return resultado;
    }

    static async contar() {
        const [rows] = await mysqlPool.query(
            'SELECT COUNT(*) AS Total FROM Documentos'
        );
        return rows[0].Total;
    }
}

module.exports = Documentos;