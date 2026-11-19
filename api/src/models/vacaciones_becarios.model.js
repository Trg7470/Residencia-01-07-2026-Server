const { mysqlPool } = require('../config/mysql');

class VacacionesBecarios {
    // Registrar una nueva solicitud de vacaciones
    static async crear(datos, connection = mysqlPool) {
        const {
            Id_Carpeta,
            Id_Documento,
            Periodo,
            Cantidad_Dias,
            Periodo_De,
            Periodo_A,
            Fecha_Regreso
        } = datos;

        const query = `
            INSERT INTO Vacaciones_Becarios (
                Id_Carpeta,
                Id_Documento,
                Periodo,
                Cantidad_Dias,
                Periodo_De,
                Periodo_A,
                Fecha_Regreso    
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        const [resultado] = await connection.query(query, [
            Id_Carpeta,
            Id_Documento,
            Periodo,
            Cantidad_Dias,
            Periodo_De,
            Periodo_A,
            Fecha_Regreso
        ]);
        return resultado;
    }

    // Obtener las solicitudes de un expediente
    static async obtenerPorCarpeta(Id_Carpeta) {
        const query = `
            SELECT
                v.Id_Vacaciones,
                v.Id_Carpeta,
                v.Id_Documento,
                v.Periodo,
                v.Cantidad_Dias,
                v.Periodo_De,
                v.Periodo_A,
                v.Fecha_Regreso,
                v.Fecha_Solicitud,
                d.Nombre AS Nombre_Documento,
                d.Drive_File_Id
            FROM Vacaciones_Becarios v
            INNER JOIN Documentos d
            ON v.Id_Documento = d.Id_Documento
            WHERE v.Id_Carpeta = ?
            ORDER BY v.Fecha_Solicitud ASC
        `;

        const [filas] = await mysqlPool.query(query, [Id_Carpeta]);
        return filas;
    }

    // Verificar si las fechas solicitadas ya fueron utilizadas
    static async verificarFechasUtilizadas(
        Id_Carpeta,
        Periodo_De,
        Periodo_A,
        connection = mysqlPool
    ) {
        const query = `
            SELECT COUNT(*) AS Coincidencias
            FROM Vacaciones_Becarios
            WHERE Id_Carpeta = ?
            AND Periodo_De <= ?
            AND Periodo_A >= ?
        `;

        const [filas] = await connection.query(query, [
            Id_Carpeta,
            Periodo_A,
            Periodo_De
        ]);

        return Number(filas[0].Coincidencias) > 0;
    }

    // Obtener los días utilizados de un periodo y año
    static async obtenerDiasUtilizados(
        Id_Carpeta,
        Periodo,
        Anio = new Date().getFullYear(),
        connection = mysqlPool
    ) {
        // Compatibilidad con llamadas anteriores que pasaban la conexión como tercer argumento
        if (typeof Anio !== "number") {
            connection = Anio;
            Anio = new Date().getFullYear();
        }

        const query = `
            SELECT COALESCE(SUM(Cantidad_Dias), 0) AS Dias_Utilizados
            FROM Vacaciones_Becarios
            WHERE Id_Carpeta = ?
            AND Periodo = ?
            AND YEAR(Periodo_De) = ?
        `;

        const [filas] = await connection.query(query, [
            Id_Carpeta,
            Periodo,
            Anio
        ]);

        return Number(filas[0].Dias_Utilizados);
    }

    // Obtener los días disponibles de un periodo y año
    static async obtenerDiasDisponibles(
        Id_Carpeta,
        Periodo,
        Anio = new Date().getFullYear(),
        connection = mysqlPool
    ) {
        const utilizados = await this.obtenerDiasUtilizados(
            Id_Carpeta,
            Periodo,
            Anio,
            connection
        );

        return Math.max(0, 10 - utilizados);
    }
}

module.exports = VacacionesBecarios;