const { mysqlPool } = require('../config/mysql');

class DatosPersonales {
    static async guardar_datos(data) {
        const {
            Nombre,
            Apellido_Paterno,
            Apellido_Materno,
            RFC,
            CURP,
            Fecha_Nac,
            Lugar_Nac,
            Telefono,
            Telefono_Casa,
            Correo,
            Calle_Numero,
            Colonia,
            Ciudad,
            Codigo_Postal,
            Estado,
            Estado_Civil,
            Fecha_Registro
        } = data;
        const [result] = await mysqlPool.query(
            `INSERT INTO Datos_Personales(Nombre,
            Apellido_Paterno,
            Apellido_Materno,
            RFC,
            CURP,
            Fecha_Nac,
            Lugar_Nac,
            Telefono,
            Telefono_Casa,
            Correo,
            Calle_Numero,
            Colonia,
            Ciudad,
            Codigo_Postal,
            Estado,
            Estado_Civil,
            Fecha_Registro) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,NOW())`,
            [
            Nombre,
            Apellido_Paterno,
            Apellido_Materno,
            RFC,
            CURP,
            Fecha_Nac,
            Lugar_Nac,
            Telefono,
            Telefono_Casa,
            Correo,
            Calle_Numero,
            Colonia,
            Ciudad,
            Codigo_Postal,
            Estado,
            Estado_Civil,
            Fecha_Registro
            ]
        );
        return result;
    }
}

module.exports = DatosPersonales