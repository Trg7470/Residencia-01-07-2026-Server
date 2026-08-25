const { mysqlPool } = require('../config/mysql');

class CarpetasDrive
{
    static async crear_carpeta(data)
    {
        const {Drive_Folder_Id, Nombre_Carpeta, Id_Adscripcion} = data;
        const [result] = await mysqlPool.query(
            `INSERT INTO Carpetas_Drive (Drive_Folder_Id, Nombre_Carpeta, Id_Adscripcion) VALUES (?, ?, ?)`,
            [Drive_Folder_Id, Nombre_Carpeta, Id_Adscripcion]
        );
        return result.insertId;
    }
}

module.exports = CarpetasDrive;