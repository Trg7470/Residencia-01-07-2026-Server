const TiposPersonal = require('../models/tipos_personal.model');

class TiposPersonalController
{
    static async all(req, res)
    {
        try {
            const result = await TiposPersonal.all();
            res.status(201).json({message: "Datos obtenidos exitosamente", result});
        } catch (error) {
            console.log(error);
            res.status(500).json({error: "Error al obtener los Tipos de Personal"});
        }
    }
}

module.exports = TiposPersonalController;