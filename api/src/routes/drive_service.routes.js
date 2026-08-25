const express = require('express');
const router = express.Router();
const DriveServiceController = require('../controllers/drive_service.controller');

router.get('/descargar/:idArchivo', DriveServiceController.descargar_archivo);
router.get('/listar/:carpetaId', DriveServiceController.listar_archivos);
router.get('/listar/carpeta/:carpetaId', DriveServiceController.listar_archivos_carpeta);
router.get('/buscar/:nombre', DriveServiceController.buscar_archivo);
router.post('/crear/carpeta', DriveServiceController.crear_carpeta);
router.get('/obtener/:idArchivo', DriveServiceController.obtener_archivo);
router.get('/obtener/link/:idArchivo', DriveServiceController.obtener_link);
router.post('/subir/:carpetaId', DriveServiceController.subir_archivo);
router.delete('/eliminar/:idArchivo', DriveServiceController.eliminar_archivo);
router.put('/actualizar/:idArchivo', DriveServiceController.actualizar_archivo);
router.put('/renombrar/:idArchivo', DriveServiceController.renombrar_archivo);
router.put('/mover/:idArchivo', DriveServiceController.mover_archivo);
router.get('/obtener/carpeta/:carpetaId', DriveServiceController.obtener_carpeta);
router.get('/obtener/:nombre/:carpetaPadre', DriveServiceController.obtener_o_crear_carpeta);
router.post('/crear/expediente', DriveServiceController.crear_ruta_expediente);

module.exports = router;
