const Escuelas = require('../models/escuelas.model');

class EscuelasController 
{
    static async all(req, res) {
        try {
            const result = await Escuelas.all();
            res.json(result);
        } catch (error) {
            res.status(500).json
                (
                    {
                        mensaje: "Error al obtener escuelas",
                        error: error.message
                    }
                )
        }
    }
    static async tipo_municipio(req, res) {
        const { tipo, municipio } = req.params;
        try {
            const result = await Escuelas.tipo_municipio(tipo,municipio);
            res.json(result);
        } catch (error) {
            res.status(500).json(
                {
                    mensaje: "Error al obtener escuelas",
                    error: error.message
                }
            )
        }
    }
}

module.exports = EscuelasController;