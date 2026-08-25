const DatosPersonales = require('../models/datos_personales.model');

class DatosPersonalesController {
    static async guardar_datos(req, res) {
        const data = req.body;
        try {
            const result = await DatosPersonales.guardar_datos(data);
            res.status(201).json({ message: 'Datos del prestador guardados correctamente.', result});
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: "No se pudieron guardar los datos." });
        }
    }
}

module.exports = DatosPersonalesController;