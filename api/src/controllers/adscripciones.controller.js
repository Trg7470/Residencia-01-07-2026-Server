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

    // Obtener comisiones de una persona
    static async listar_comisiones(req, res) {
        const { id_persona } = req.params;

        try 
        {
            const resultado = await Adscripciones.listar_comisiones(id_persona);
            res.status(200).json(resultado);
        } catch (error) {
            console.log(error);
            res.status(500).json({error: "No se pudieron obtener las comisiones."});
        }
    }

    static async obtener_cifrhs_principal(req, res) {
        const { id_persona } = req.params;
        try {
            const resultado = await Adscripciones.obtener_cifrhs_principal(id_persona);

            if (!resultado) {
                return res.status(404).json({
                    error: "No se encontró la adscripción principal."
                });
            }

            res.status(200).json(resultado);

        } catch (error) {
            console.log(error);
            res.status(500).json({
                error: "No se pudo obtener el CIFRHS."
            });
        }
    }
}

module.exports = AdscripcionesController;