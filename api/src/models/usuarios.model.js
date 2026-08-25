const { mysqlPool } = require('../config/mysql');

class Usuarios {
    static async all() {
        const [rows] = await mysqlPool.query(
            'SELECT Id_Usuario, Nombre, Apellido_Paterno, Apellido_Materno, Correo, Fecha_Registro,' +
            'Estado, Tipo_Usuario, Ultimo_Acceso FROM Usuarios ORDER BY Id_Usuario ASC');
        return rows;
    }

    static async userbyId(id) {
        const [rows] = await mysqlPool.query(
            `SELECT Id_Usuario, Nombre, Apellido_Paterno, Apellido_Materno, Sexo, Fecha_Nacimiento,
        Direccion, Telefono, Especialidad, Cedula_Prof, Correo,Fecha_Registro,
        Estado, Tipo_Usuario, User_Key, Ultimo_Acceso
        FROM Usuarios 
        WHERE Id_Usuario = ?`,
            [id]
        );
        return rows;
    }

    static async usersResume() {
        const [rows] = await mysqlPool.query(
            `SELECT Id_Usuario, Nombre, Apellido_Paterno, Apellido_Materno, Correo, Fecha_Registro,
            Estado, Tipo_Usuario, Ultimo_Acceso
            FROM Usuarios`
        )
        return rows;
    }

    static async createUser(data) {
        const {
            Nombre,
            Apellido_Paterno,
            Apellido_Materno,
            Sexo,
            Fecha_Nacimiento,
            Direccion,
            Telefono,
            Especialidad,
            Cedula_Prof,
            Correo,
            Contrasena,
            Fecha_Registro,
            Estado,
            Tipo_Usuario,
            User_Key
        } = data;

        const [result] = await mysqlPool.query(
            `INSERT INTO Usuarios
        (Nombre, Apellido_Paterno, Apellido_Materno, Sexo, Fecha_Nacimiento, Direccion, Telefono, Especialidad,
        Cedula_Prof, Correo, Contrasena, Fecha_Registro, Estado, Tipo_Usuario, User_Key)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                Nombre,
                Apellido_Paterno,
                Apellido_Materno,
                Sexo,
                Fecha_Nacimiento,
                Direccion,
                Telefono,
                Especialidad,
                Cedula_Prof,
                Correo,
                Contrasena,
                Fecha_Registro,
                Estado,
                Tipo_Usuario,
                User_Key
            ]
        );

        return result;
    }

    static async updateUser(id, data) {
        const {
            Nombre,
            Apellido_Paterno,
            Apellido_Materno,
            Sexo,
            Fecha_Nacimiento,
            Direccion,
            Telefono,
            Especialidad,
            Cedula_Prof,
            Correo,
            Estado,
            Tipo_Usuario
        } = data;

        const [result] = await mysqlPool.query(
            `UPDATE Usuarios SET
        Nombre = ?, Apellido_Paterno = ?, Apellido_Materno = ?, Sexo = ?, Fecha_Nacimiento = ?, 
        Direccion = ?, Telefono = ?, Especialidad = ?, Cedula_Prof = ?, Correo = ?, 
        Estado = ?, Tipo_Usuario = ?
        WHERE Id_Usuario = ?`,
            [
                Nombre,
                Apellido_Paterno,
                Apellido_Materno,
                Sexo,
                Fecha_Nacimiento,
                Direccion,
                Telefono,
                Especialidad,
                Cedula_Prof,
                Correo,
                Estado,
                Tipo_Usuario,
                id
            ]
        );

        return result;
    }

    static async deleteUser(id) {
        const [result] = await mysqlPool.query(
            `DELETE FROM Usuarios WHERE Id_Usuario= ?`,
            [id]
        );
        return result;
    }
    static async checkUser(email) {
        try {
            const [rows] = await mysqlPool.query
                (
                    `SELECT Id_Usuario, Correo
                 FROM Usuarios 
                 WHERE Correo = ?`,
                    [email]
                );

            if (rows.length > 0) {
                return {
                    success: true,
                    user: rows[0]
                };
            } else {
                return { success: false };
            }

        } catch (error) {
            throw error;
        }
    }
    static async resetPassword(email, newPassword) {
        try {
            const [rows] = await mysqlPool.query
                (
                    `UPDATE Usuarios 
                     SET Contrasena = ? 
                     WHERE Correo = ?`,
                    [newPassword, email]
                );
            if (rows.affectedRows > 0) { return { success: true }; }
            else { return { success: false }; }
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Usuarios;