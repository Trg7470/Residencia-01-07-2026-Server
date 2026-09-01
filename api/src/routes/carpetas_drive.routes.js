const express = require('express');
const router = express.Router();
const CarpetasDriveController = require('../controllers/carpetas_drive.controller');

router.post('/crear', CarpetasDriveController.crear_carpeta);
router.get('/count', CarpetasDriveController.contar);

module.exports = router;