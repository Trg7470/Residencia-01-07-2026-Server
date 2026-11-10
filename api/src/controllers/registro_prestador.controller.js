const Registro_Prestador_Service = require('../services/registro_prestador.service');

class Registro_Prestador_Controller {
    static async registrar(req, res) {
        try {
            const { datos_personales_data,
                beneficiarios_data,
                adscripciones_data,
                carpeta_drive_data,
                datos_escolares_data,
                contactos_emergencia_data, } = req.body;
            const resultado = await Registro_Prestador_Service.registrar(datos_personales_data, beneficiarios_data,
                adscripciones_data, carpeta_drive_data ,datos_escolares_data, contactos_emergencia_data);

            return res.status(201).json({
                mensaje: 'Prestador registrado correctamente.',
                resultado
            });
        } catch (error) {
            console.error('Error al registrar prestador:', error);

            return res.status(error.status || 500).json({
                mensaje: error.status ? error.message : 'Error interno al registrar el prestador.'
            });
        }
    }
}

module.exports = Registro_Prestador_Controller;
