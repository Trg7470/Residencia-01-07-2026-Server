const path = require('path');
const fs = require('fs'); // Asegúrate de incluir también fs si usas fs.existsSync o fs.unlinkSync
const DriveService = require('../services/drive.service');

class DriveServiceController {
    static async descargar_archivo(req, res) {
        const { idArchivo } = req.params;
        try {
            const archivoStream = await DriveService.descargar_archivo(idArchivo);
            res.setHeader('Content-Disposition', `attachment; filename="${idArchivo}"`);
            archivoStream.data.pipe(res);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al descargar el archivo' });
        }
    }
    static async listar_archivos(req, res) {
        const { carpetaId } = req.params;
        try {
            const archivos = await DriveService.listar_archivos_carpeta(carpetaId);
            res.status(200).json(archivos);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al listar los archivos' });
        }
    }

    static async listar_archivos_carpeta(req, res) {
        const { carpetaId } = req.params;
        try {
            const archivos = await DriveService.listar_archivos_carpeta(carpetaId);
            res.status(200).json(archivos);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al listar los archivos de la carpeta' });
        }
    }

    static async buscar_archivo(req, res) {
        const { nombre } = req.params;
        try {
            const archivos = await DriveService.buscar_archivo(nombre);
            res.status(200).json(archivos);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al buscar el archivo' });
        }
    }
    static async crear_carpeta(req, res) {
        const { nombre, carpetaPadre } = req.body;
        try {
            const carpeta = await DriveService.crear_carpeta(nombre, carpetaPadre);
            res.status(201).json(carpeta);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al crear la carpeta' });
        }
    }
    static async subir_archivo(req, res) {
        const { carpetaId } = req.params;
        const { nombreArchivo } = req.body;
        try {
            if (!nombreArchivo) {
                return res.status(400).json({ error: 'El parámetro nombreArchivo es requerido.' });
            }
            const rutaAbsoluta = path.join(__dirname, '../../storage/temporales/pdf', nombreArchivo);
            if (!fs.existsSync(rutaAbsoluta)) {
                return res.status(404).json({
                    error: `No se encontró el PDF local en: ${rutaAbsoluta}`
                });
            }
            const archivo = await DriveService.subir_archivo(
                nombreArchivo,
                rutaAbsoluta,
                carpetaId
            );
            if (fs.existsSync(rutaAbsoluta)) {
                fs.unlinkSync(rutaAbsoluta);
            }
            return res.status(201).json(archivo);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error al subir el archivo a Drive' });
        }
    }
    static async eliminar_archivo(req, res) {
        const { idArchivo } = req.params;
        try {
            await DriveService.eliminar_archivo(idArchivo);
            res.status(200).json({ message: 'Archivo eliminado exitosamente' });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al eliminar el archivo' });
        }
    }
    static async actualizar_archivo(req, res) {
        const { idArchivo } = req.params;
        const { nombreArchivo } = req.body; // Se recibe por JSON

        try {
            if (!nombreArchivo) {
                return res.status(400).json({ error: 'El parámetro nombreArchivo es requerido' });
            }

            // Armamos la ruta local hacia la carpeta temporales
            const rutaAbsoluta = path.join(__dirname, '../../storage/temporales/pdf', nombreArchivo);

            if (!fs.existsSync(rutaAbsoluta)) {
                return res.status(404).json({ error: `No existe el archivo local: ${nombreArchivo}` });
            }

            // Actualizamos en Google Drive
            const archivo = await DriveService.actualizar_archivo(idArchivo, rutaAbsoluta);

            // Limpiamos el temporal local
            if (fs.existsSync(rutaAbsoluta)) {
                fs.unlinkSync(rutaAbsoluta);
            }

            return res.status(200).json(archivo);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error al actualizar el archivo en Drive' });
        }
    }
    static async renombrar_archivo(req, res) {
        const { idArchivo } = req.params;
        const { nuevoNombre } = req.body;
        try {
            const archivo = await DriveService.renombrar_archivo(idArchivo, nuevoNombre);
            res.status(200).json(archivo);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al renombrar el archivo' });
        }
    }
    static async mover_archivo(req, res) {
        const { idArchivo } = req.params;
        const { carpetaOrigen, carpetaDestino } = req.body;
        try {
            const archivo = await DriveService.mover_archivo(idArchivo, carpetaOrigen, carpetaDestino);
            res.status(200).json(archivo);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al mover el archivo' });
        }
    }
    static async obtener_link(req, res) {
        const { idArchivo } = req.params;
        try {
            const link = await DriveService.obtener_link(idArchivo);
            res.status(200).json({ link });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener el link del archivo' });
        }
    }

    static async obtener_archivo(req, res) {
        const { idArchivo } = req.params;
        try {
            const archivo = await DriveService.obtener_archivo(idArchivo);
            res.status(200).json(archivo);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener el archivo' });
        }
    }

    static async obtener_carpeta(req, res) {
        const { carpetaId } = req.params;
        try {
            const carpeta = await DriveService.obtener_carpeta(carpetaId);
            res.status(200).json(carpeta);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener la carpeta' });
        }
    }

    static async obtener_o_crear_carpeta(req, res) {
        const { nombre, carpetaPadre } = req.body;
        try {
            const carpeta = await DriveService.obtener_o_crear_carpeta(nombre, carpetaPadre);
            res.status(200).json(carpeta);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener o crear la carpeta' });
        }
    }

    static async crear_ruta_expediente(req, res) {
        const { datos } = req.body;
        try {
            const expediente = await DriveService.crear_ruta_expediente(datos);
            res.status(200).json({
                expediente,
                success: true
            });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al crear la ruta del expediente' });
        }
    }
}

module.exports = DriveServiceController;