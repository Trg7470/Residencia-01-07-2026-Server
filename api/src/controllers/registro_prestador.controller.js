const Registro_Prestador_Service = require('../services/registro_prestador.service');

class Registro_Prestador_Controller {
    static async registrar(req, res) {
        try {
            const { 
                datos_personales_data,
                beneficiarios_data,
                adscripciones_data,
                carpeta_drive_data,
                datos_escolares_data,
                contactos_emergencia_data,
                documento_data
            } = req.body;
            const resultado = await Registro_Prestador_Service.registrar(
                datos_personales_data, 
                beneficiarios_data,
                adscripciones_data, 
                carpeta_drive_data,
                datos_escolares_data, 
                contactos_emergencia_data,
                documento_data
            );

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

    static async consultarBeneficiarios(req, res) {
        try {
            const { idCarpeta } = req.params;

            if (!idCarpeta || !Number.isInteger(Number(idCarpeta))) {
                return res.status(400).json({
                    mensaje: 'El identificador de la carpeta no es válido.'
                });
            }

            const beneficiarios = await require('../models/beneficiarios.model').consultarPorCarpeta(Number(idCarpeta));

            return res.status(200).json({
                beneficiarios
            });
        } catch (error) {
            console.error('Error al consultar los beneficiarios.');
            return res.status(500).json({
                mensaje: 'Error al consultar los beneficiarios.'
            });
        }
    }
}

module.exports = Registro_Prestador_Controller;