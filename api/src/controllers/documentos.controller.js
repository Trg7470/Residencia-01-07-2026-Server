const Documentos = require('../models/documentos.model');

class DocumentosController {
    // POST /api/documentos/registrar
    static async registrar(req, res) {
        try {
            const { 
                Nombre, 
                Drive_File_Id, 
                Subido_Por_Usuario, 
                Id_Carpeta_Documento, 
                Id_Tipo_Doc_D 
            } = req.body;

            // Validación de campos obligatorios según la BD
            if (!Nombre || !Drive_File_Id || !Subido_Por_Usuario || !Id_Carpeta_Documento || !Id_Tipo_Doc_D) {
                return res.status(400).json({ 
                    error: 'Faltan campos obligatorios para registrar el documento.' 
                });
            }

            const resultado = await Documentos.crear(req.body);

            return res.status(201).json({
                mensaje: 'Documento registrado exitosamente.',
                insertId: resultado.insertId
            });
        } catch (error) {
            console.error('Error al registrar documento:', error);
            
            // Manejo de duplicado en Drive_File_Id (clave UQ)
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ error: 'El Drive_File_Id ya se encuentra registrado.' });
            }

            return res.status(500).json({ error: 'Error interno del servidor.' });
        }
    }

    // GET /api/documentos/:id
    static async obtenerPorId(req, res) {
        try {
            const { id } = req.params;
            const documento = await Documentos.obtenerPorId(id);

            if (!documento) {
                return res.status(404).json({ error: 'Documento no encontrado.' });
            }

            return res.status(200).json(documento);
        } catch (error) {
            console.error('Error al obtener documento:', error);
            return res.status(500).json({ error: 'Error interno del servidor.' });
        }
    }

    // GET /api/documentos/carpeta/:idCarpeta
    static async obtenerPorCarpeta(req, res) {
        try {
            const { idCarpeta } = req.params;
            const documentos = await Documentos.obtenerPorCarpeta(idCarpeta);
            return res.status(200).json(documentos);
        } catch (error) {
            console.error('Error al listar documentos:', error);
            return res.status(500).json({ error: 'Error interno del servidor.' });
        }
    }

    // DELETE /api/documentos/:id
    static async eliminar(req, res) {
        try {
            const { id } = req.params;
            const resultado = await Documentos.eliminar(id);

            if (resultado.affectedRows === 0) {
                return res.status(404).json({ error: 'Documento no encontrado para eliminar.' });
            }

            return res.status(200).json({ mensaje: 'Documento eliminado correctamente.' });
        } catch (error) {
            console.error('Error al eliminar documento:', error);
            return res.status(500).json({ error: 'Error interno del servidor.' });
        }
    }

    static async contar(req, res) {
        try {
            const total = await Documentos.contar();
            return res.status(200).json({ total });
        } catch (error) {
            console.error('Error al contar documentos:', error);
            return res.status(500).json({ error: 'Error interno del servidor.' });
        }
    }
}

module.exports = DocumentosController;