const DatosEscolares = require('../models/datos_escolares.model');

class DatosEscolaresController
{
    static async save(req, res)
    {
        const data = req.body;
        try
        {
            const result = await DatosEscolares.guardar(data);
            res.status(201).json({message: "Datos escolares registrados correctamente.", result});
        }
        catch(error)
        {
            console.log(error);
            res.status(500).json({error: "No se pudieron registrar los datos escolares"});
        }
    }

    // Obtener datos para el formato de vacaciones
    static async obtenerPorPersona(req, res)
    {
        const {id} = req.params;

        try {
            const resultado = await DatosEscolares.obtenerPorPersona(id);
            if(!resultado)
            {
                return res.status(404).json({
                    mensaje: "No se encontraron datos para esta persona."
                });
            }
            res.status(200).json(resultado);
        } catch (error)
        {
            console.error(error);
            res.status(500).json({
                mensaje: "Error al obtener los datos de la persona.",
                error: error.message
            });
        }
    }
}


module.exports = DatosEscolaresController;