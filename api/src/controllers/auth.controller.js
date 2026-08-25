const Auth = require('../models/auth.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

class AuthController {

    static async login(req, res) {
        const { email, password } = req.body;

        try {
            const resultado = await Auth.login(email);

            if (!resultado.success) {
                return res.status(401).json({
                    success: false,
                    message: "Credenciales incorrectas"
                });
            }

            const usuario = resultado.user;
            const passwordValido = await bcrypt.compare(password, usuario.Contrasena);

            if (!passwordValido) {
                return res.status(401).json({
                    success: false,
                    message: "Credenciales incorrectas"
                });
            }

            const token = jwt.sign(
                {
                    id_usuario: usuario.Id_Usuario,
                    tipo_usuario: usuario.Tipo_Usuario
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: process.env.JWT_EXPIRES_IN || '6h'
                }
            );

            res.json({
                success: true,
                token,
                data: {
                    id_usuario: usuario.Id_Usuario,
                    tipo_usuario: usuario.Rol,
                    correo: usuario.Correo
                }
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Error en el servidor",
                error: error.message
            });
        }
    }
}

module.exports = AuthController;