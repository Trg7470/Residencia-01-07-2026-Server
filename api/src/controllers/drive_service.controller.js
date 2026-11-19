const path = require('path');
const fs = require('fs'); // Asegúrate de incluir también fs si usas fs.existsSync o fs.unlinkSync
const DriveService = require('../services/drive.service');
const { error } = require('console');
const Documentos = require('../models/documentos.model');

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

            return res.status(200).json({
                message: 'El archivo fue eliminado o ya no existía en Google Drive.'
            });

        } catch (error) {
            console.error('Error al eliminar archivo de Drive:', error);

            return res.status(500).json({
                error: 'Error al eliminar el archivo de Google Drive.'
            });
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

    static async subir_documento(req, res) {
        const { carpetaId } = req.params;
        try {
            if (!req.file) {
                return res.status(400).json({
                    error: 'No se recibió ningún archivo.'
                });
            }

            const archivo = await DriveService.subir_archivo(
                req.file.originalname,
                req.file.path,
                carpetaId
            );

            return res.status(201).json({
                success: true,
                mensaje: 'Documento cargado correctamente.',
                archivo
            });
        } catch (error) {
            console.error('Error al subir documento:', error);
            return res.status(500).json({
                error: 'Error al subir el documento a Google Drive.'
            });
        } finally {
            if(req.file?.path && fs.existsSync(req.file.path)) {
                try {
                    fs.unlinkSync(req.file.path);
                } catch (error) {
                    console.error('No se pudo eliminar el archivo temporal:', error);
                }
            }
        }
    }

    static async subir_documentoBeneficiario(req, res) {
        const { carpetaId } = req.params;
        let archivoDrive = null;

        try {
            if (!req.file) {
                return res.status(400).json({
                    error: 'No se recibió ningún archivo.'
                });
            }

            const { tipoDocumento, nombreBeneficiario, numeroBeneficiario, Subido_Por_Usuario } = req.body;

            // Validar el tipo de documento
            const tipos = {
                acta: {
                    id: 33,
                    prefijo: `Acta_Nacimiento`,
                    mime: 'application/pdf'
                },
                curp: {
                    id: 34,
                    prefijo: 'CURP',
                    mime: 'application/pdf'
                },
                fotografia: {
                    id: 35,
                    prefijo: 'Fotografia',
                    mime: ['image/jpeg', 'image/png']
                }
            };

            const configuracion = tipos[tipoDocumento];

            if (!configuracion) {
                return res.status(400).json({
                    error: 'El tipo de documento no es válido.'
                });
            }

            if (!nombreBeneficiario || !numeroBeneficiario || !Subido_Por_Usuario) {
                return res.status(400).json({
                    error: 'Faltan datos del beneficiario o del usuario.'
                });
            }

            const idCarpeta = Number(carpetaId);
            const numero = Number(numeroBeneficiario);
            const idUsuario = Number(Subido_Por_Usuario);

            if (
                !Number.isInteger(idCarpeta) || idCarpeta <= 0 ||
                !Number.isInteger(numero) || numero < 1 || numero > 3 ||
                !Number.isInteger(idUsuario) || idUsuario <= 0
            ) {
                return res.status(400).json({
                    error: 'Los datos proporcionados no son válidos.'
                });
            }

            const mimeValido = Array.isArray(configuracion.mime)
                ? configuracion.mime.includes(req.file.mimetype)
                : configuracion.mime === req.file.mimetype;

            if (!mimeValido) {
                return res.status(400).json({
                    error: 'El formato del archivo no corresponde al documento.'
                });
            }

            // Obtener la carpeta de google drive desde mysql
            const [carpetas] = await require('../config/mysql').mysqlPool.query(
                `SELECT Drive_Folder_Id
                FROM carpetas_drive
                WHERE Id_Carpeta = ?
                LIMIT 1`,
                [idCarpeta]
            );

            if (!carpetas.length) {
                return res.status(404).json({
                    error: 'No se encontró la carpeta del expediente.'
                });
            }

            // Preparar nombre del archivo
            const nombreLimpio = nombreBeneficiario
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-zA-Z0-9]+/g, '_')
                .replace(/^_|_$/g, '');

            const extension = path.extname(req.file.originalname).toLowerCase();

            const nombreArchivo = `${configuracion.prefijo}_Beneficiario${numero}_${nombreLimpio}${extension}`;

            // Subir a google
            archivoDrive = await DriveService.subir_archivo(
                nombreArchivo,
                req.file.path,
                carpetas[0].Drive_Folder_Id
            );

            // Registrar en mysql
            const resultado = await Documentos.crear({
                Nombre: nombreArchivo,
                Drive_File_Id: archivoDrive.id,
                Mime_Type: req.file.mimetype,
                Tamano: req.file.size,
                Subido_Por_Usuario: idUsuario,
                Id_Carpeta_Documento: idCarpeta,
                Id_Tipo_Doc_D: configuracion.id
            });

            return res.status(201).json({
                success: true,
                mensaje: 'Documento del beneficiario cargado correctamente.',
                documento: {
                    Id_Documento: resultado.insertId,
                    Nombre: nombreArchivo,
                    Drive_File_Id: archivoDrive.id,
                    Id_Tipo_Doc_D: configuracion.id
                }
            });
        } catch (error) {
            console.error('Error al subir documento de beneficiario:', error);

            // Si falla el registro, eliminar de drive
            if (archivoDrive?.id) {
                try {
                    await DriveService.eliminar_archivo(archivoDrive.id);
                } catch (errorDrive) {
                    console.error('No se pudo eliminar el archivo de Drive:', errorDrive);
                }
            }

            return res.status(500).json({
                error: 'Error al subir el documento del beneficiario.'
            });
        } finally {
            if (req.file?.path && fs.existsSync(req.file.path)) {
                try {
                    fs.unlinkSync(req.file.path);
                } catch (error) {
                    console.error('No se pudo eliminar el archivo temporal:', error);
                }
            }
        }
    }

    static async ver_documentoBeneficiario(req, res) {
        const { idDocumento } = req.params;
        try {
            const documento = await Documentos.obtenerPorId(idDocumento);

            if (!documento || ![33, 34, 35].includes(Number(documento.Id_Tipo_Doc_D))) {
                return res.status(404).json({
                    error: 'No se encontró el documento del beneficiario.'
                });
            }

            const archivoStream = await DriveService.descargar_archivo(
                documento.Drive_File_Id
            );

            res.setHeader('Content-Type', documento.Mime_Type);
            res.setHeader(
                'Content-Disposition',
                `inline; filename="${encodeURIComponent(documento.Nombre)}"`
            );

            archivoStream.data.on('error', error => {
                console.error('Error al transmitir documento:', error);

                if (!res.headersSent) {
                    res.status(500).json({
                        error: 'No fue posible mostrar el documento.'
                    });
                } else {
                    res.destroy(error);
                }
            });
            archivoStream.data.pipe(res);
        } catch (error) {
            console.error('Error al visualizar documento del beneficiario:', error);

            if (!res.headersSent) {
                res.status(500).json({
                    error: 'Error al mostrar el documento.'
                });
            }
        }
    }

    static async eliminar_documentoBeneficiario(req, res) {
        const { idDocumento } = req.params;

        try {
            const documento = await Documentos.obtenerPorId(idDocumento);

            if (!documento || ![33, 34, 35].includes(Number(documento.Id_Tipo_Doc_D))) {
                return res.status(404).json({
                    error: 'No se encontró el documento del beneficiario.'
                });
            }

            // Primero eliminar el archivo de google drive
            await DriveService.eliminar_archivo(documento.Drive_File_Id);

            // Eliminar de mysql
            const resultado = await Documentos.eliminar(idDocumento);

            if (!resultado.affectedRows) {
                return res.status(404).json({
                    error: 'No se encontro el registro del documento en mysql.'
                });
            }

            return res.status(200).json({
            success: true,
            mensaje: 'Documento eliminado correctamente.'
            });
        
        } catch (error) {
            console.error('Error al eliminar documento del beneficiario:', error);

            return res.status(500).json({
                error: 'No fue posible eliminar el documento del beneficiario.'
            });
        }
    }

    static async descargar_documentoBeneficiario(req, res) {
        const { idDocumento } = req.params;

        try {
            const documento = await Documentos.obtenerPorId(idDocumento);

            if (!documento || ![33, 34, 35].includes(Number(documento.Id_Tipo_Doc_D))) {
                return res.status(404).json({
                    error: 'No se encontró el documento del beneficiario.'
                });
            }

            const archivoStream = await DriveService.descargar_archivo(
                documento.Drive_File_Id
            );

            res.setHeader('Content-Type', documento.Mime_Type);

            res.setHeader(
                'Content-Disposition',
                `attachment; filename*=UTF-8''${encodeURIComponent(documento.Nombre)}`
            );

            archivoStream.data.pipe(res);

        } catch (error) {
            console.error('Error al descargar documento del beneficiario:', error);

            if (!res.headersSent) {
                res.status(500).json({
                    error: 'No fue posible descargar el documento.'
                });
            }
        }
    }
}

module.exports = DriveServiceController;