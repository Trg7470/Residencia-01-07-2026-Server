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
}

module.exports = DatosEscolaresController;