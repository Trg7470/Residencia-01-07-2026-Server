const CarpetasDrive = require('../models/carpetas_drive.model');

class CarpetasDriveController {
    static async crear_carpeta(req, res) {
        const { Drive_Folder_Id, Nombre_Carpeta, Id_Adscripcion} = req.body;
        try {
            const result = await CarpetasDrive.crear_carpeta({ Drive_Folder_Id, Nombre_Carpeta, Id_Adscripcion});
            res.status(201).json({ message: 'Carpeta creada exitosamente', carpetaId: result });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al crear la carpeta' });
        }
    }
}

module.exports = CarpetasDriveController;