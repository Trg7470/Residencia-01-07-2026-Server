const Carreras = require('../models/carreras.model');

class CarrerasController 
{
    static async all(req, res) {
        try {
            const result = await Carreras.all();
            res.json(result);
        } catch (error) {
            res.status(500).json
                (
                    {
                        mensaje: "Error al obtener carreras",
                        error: error.message
                    }
                )
        }
    }
    static async type(req, res) {
        const { tipo } = req.params;
        try {
            const result = await Carreras.type(tipo);
            res.json(result);
        } catch (error) {
            res.status(500).json(
                {
                    mensaje: "Error al obtener carreras",
                    error: error.message
                }
            )
        }
    }
}

module.exports = CarrerasController;