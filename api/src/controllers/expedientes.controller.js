const ExpedientesModel = require('../models/expedientes.model');

class ExpedientesController {
    static async listar(req, res) {
        try {
            const resultado = await ExpedientesModel.listar();
            res.status(200).json(resultado);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: "No se pudieron obtener los expedientes." });
        }
    }

    static async informacion_general(req, res) {
        const { id_carpeta } = req.params;
        try {
            const resultado = await ExpedientesModel.obtener_general(id_carpeta);
            res.status(200).json(resultado);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: "No se pudo obtener la información general del expediente." });
        }
    }
}
module.exports = ExpedientesController;