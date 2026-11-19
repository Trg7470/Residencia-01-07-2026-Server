const { mysqlPool } = require('../config/mysql');

class Documentos {
    // Registrar un nuevo documento
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
            INSERT INTO Documentos (
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
            Id_Tipo_Doc_D,
        ]);

        return resultado;

    }

    // Actualizar un documento existente
    static async actualizar(datos, connection = mysqlPool) {
        const {
            Id_Documento,
            Nombre,
            Drive_File_Id,
            Mime_Type,
            Tamano,
            Fecha_Subida,
            Subido_Por_Usuario,
            Id_Tipo_Doc_D,
        } = datos;

        const query = `
            UPDATE Documentos SET
                Nombre = ?,
                Drive_File_Id = ?,
                Mime_Type = ?,
                Tamano = ?,
                Fecha_Subida = ?,
                Subido_Por_Usuario = ?,
                Id_Tipo_Doc_D = ?
            WHERE Id_Documento = ?
        `;

        const [resultado] = await connection.query(query, [
            Nombre,
            Drive_File_Id,
            Mime_Type || 'application/pdf',
            Tamano ?? 0,
            Fecha_Subida || new Date(),
            Subido_Por_Usuario,
            Id_Tipo_Doc_D,
            Id_Documento
        ]);
        return resultado;
    }

    // Buscar un documento por id de drive
    static async obtenerPorDriveId(driveFileId) {
        const query = `
            SELECT * FROM Documentos
            WHERE Drive_File_Id = ?
            LIMIT 1
        `;

        const [filas] = await mysqlPool.query(query, [
            driveFileId
        ]);
        return filas[0];
    }

    // Obtener por id
    static async obtenerPorId(id) {
        const query = `
            SELECT * FROM Documentos
            WHERE Id_Documento = ?
        `;

        const [filas] = await mysqlPool.query(query, [id]);
        return filas[0];
    }

    // Listar documentos de una carpeta con su tipo de documento
    static async obtenerPorCarpeta(idCarpeta) {
        const query = `
            SELECT
                d.Id_Documento,
                d.Nombre,
                d.Drive_File_Id,
                d.Mime_Type,
                d.Tamano,
                d.Fecha_Subida,
                d.Subido_Por_Usuario,
                d.Id_Carpeta_Documento,
                d.Id_Tipo_Doc_D,
                t.Nombre AS Tipo
            FROM Documentos d
            LEFT JOIN tipos_documento t
            ON d.Id_Tipo_Doc_D = t.Id_Tipo_Documento
            WHERE d.Id_Carpeta_Documento = ?
        `;

        const [filas] = await mysqlPool.query(query, [
            idCarpeta
        ]);
        return filas;
    }

    
    // Eliminar un documento por su id
    static async eliminar(id, connectionExterna = null) {
        // Si recibimos una conexión, reutilizarla.
        // Si no, obtener una conexión propia.
        const connection = connectionExterna || await mysqlPool.getConnection();

        // Solo administrar la transacción cuando la conexión es propia.
        const manejarTransaccion = !connectionExterna;

        try {
            if (manejarTransaccion) {
                await connection.beginTransaction();
            }

            // Comprobar que el documento existe y bloquear su registro
            const [documentos] = await connection.query(
                `
                    SELECT Id_Documento
                    FROM Documentos
                    WHERE Id_Documento = ?
                    FOR UPDATE
                `,
                [id]
            );

            if (documentos.length === 0) {
                if (manejarTransaccion) {
                    await connection.rollback();
                }

                return { affectedRows: 0 };
            }

            // Eliminar la solicitud de vacaciones, si existe
            await connection.query(
                `
                    DELETE FROM Vacaciones_Becarios
                    WHERE Id_Documento = ?
                `,
                [id]
            );

            // Eliminar el documento
            const [resultado] = await connection.query(
                `
                    DELETE FROM Documentos
                    WHERE Id_Documento = ?
                `,
                [id]
            );

            if (manejarTransaccion) {
                await connection.commit();
            }

            return resultado;

        } catch (error) {
            if (manejarTransaccion) {
                await connection.rollback();
            }

            throw error;

        } finally {
            // Liberar únicamente las conexiones propias.
            // La conexión externa pertenece al servicio.
            if (manejarTransaccion) {
                connection.release();
            }
        }
    }

    // Contar todos los documentos registrados
    static async contar() {
        const query = `
            SELECT COUNT(*) AS Total
            FROM Documentos
        `;

        const [filas] = await mysqlPool.query(query);
        return Number(filas[0].Total);
    }

    // Contar los formatos pendientes de todos los expedientes
    static async contarFormatosPendientes() {
        const query = `
            SELECT
                COALESCE(
                    SUM(10 - COALESCE(d.Total_Formatos, 0)),
                    0
                ) AS Total_Pendientes
            FROM carpetas_drive c
            LEFT JOIN (
                SELECT
                    Id_Carpeta_Documento,
                    COUNT(DISTINCT Id_Tipo_Doc_D) AS Total_Formatos
                FROM Documentos
                WHERE Id_Tipo_Doc_D IN (
                    1, 2, 3, 4, 5, 6, 7, 23, 24, 36
                )
                GROUP BY Id_Carpeta_Documento
            ) d
            ON c.Id_Carpeta = d.Id_Carpeta_Documento
        `;

        const [filas] = await mysqlPool.query(query);

        return Number(filas[0].Total_Pendientes);
    }

    // Obtener un documento junto con su información de adscripción
    static async obtenerConAdscripcion(id) {
        const query = `
            SELECT
                d.Id_Documento,
                d.Nombre,
                d.Drive_File_Id,
                d.Id_Carpeta_Documento,
                d.Id_Tipo_Doc_D,
                a.Id_Adscripcion,
                a.Id_Persona_Adscripcion,
                a.Id_Unidad_Adscripcion,
                a.Fecha_Inicio,
                a.Fecha_Termino,
                a.Tipo_Adscripcion
            FROM Documentos d
            INNER JOIN carpetas_drive c
            ON d.Id_Carpeta_Documento = c.Id_Carpeta
            INNER JOIN adscripciones a
            ON c.Id_Adscripcion = a.Id_Adscripcion
            WHERE d.Id_Documento = ?
        `;

        const [filas] = await mysqlPool.query(query, [id]);
        return filas[0];
    }
}

module.exports = Documentos;