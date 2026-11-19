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

    static async informacion_general(req, res){
        const { id_carpeta } = req.params;
        try{
            const expediente = await ExpedientesModel.obtener_general(id_carpeta);
            if(!expediente){
                return res.status(404).json({
                    error: "No se encontró el expediente."
                });
            }

            // Buscar la unidad correspondiente a la adscripcion
            const unidad = await ExpedientesModel.obtener_unidad_por_nombre(
                expediente.Adscripcion
            );

            // Agregar los datos de la unidad al expediente
            if(unidad){
                expediente.Id_Unidad = unidad.Id_Unidad;
                expediente.Municipio = unidad.Municipio;
            } else {
                expediente.Id_Unidad = null;
                expediente.Municipio = "";
            }

            res.status(200).json(expediente);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({
                error: "No se pudo obtener la informacion general del expediente."
            });
        }
    }
}
module.exports = ExpedientesController;