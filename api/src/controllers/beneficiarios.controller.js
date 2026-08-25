const Beneficiarios = require('../models/beneficiarios.model');

class BeneficiariosController
{
    static async save(req,res)
    {
        const data = req.body;
        try
        {
            const result = await Beneficiarios.guardar(data);
            res.status(201).json({message:"Beneficiarios guardados correctamente.", result});
        }
        catch(error)
        {
            console.error(error);
            res.status(500).json({error: "No se pudieron guardar los datos."});
        }
    }
}

module.exports = BeneficiariosController;