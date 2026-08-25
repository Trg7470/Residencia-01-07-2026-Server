const Adscripciones = require('../models/adscripciones.model');

class AdscripcionesController
{
    static async save(req,res)
    {
        const data = req.body;
        try
        {
            const result = await Adscripciones.guardar(data);
            res.status(201).json({message: "Adscripcion registrada correctamente.", result})
        }
        catch(error)
        {
            console.log(error);
            res.status(500).json({error: "No se pudo registrar la adscripcion."});
        }
    }
}

module.exports = AdscripcionesController;