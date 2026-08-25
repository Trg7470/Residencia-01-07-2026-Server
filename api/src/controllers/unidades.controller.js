const Unidades = require('../models/unidades.model');

class UnidadesController
{
    static async all(req, res) {
        try {
            const result = await Unidades.all();
            res.json(result);
        } catch (error) {
            res.status(500).json(
                {
                    mensaje: "Error al obtener unidades",
                    error: error.message
                }
            )
        }
    }
}

module.exports = UnidadesController;