const ContactosEmergencia = require('../models/contactos_emergencia.model');

class ContactosEmergenciaController
{
     static async save(req,res)
    {
        const data = req.body;
        try
        {
            const result = await ContactosEmergencia.guardar(data);
            res.status(201).json({message: "Contacto de emergencÃ­a registrado correctamente.", result})
        }
        catch(error)
        {
            console.log(error);
            res.status(500).json({error: "No se pudo registrar el contacto de emergencÃ­a."});
        }
    }
}

module.exports = ContactosEmergenciaController;