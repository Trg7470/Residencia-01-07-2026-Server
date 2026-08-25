const express = require('express');
const router = express.Router();
const CarpetasDriveController = require('../controllers/carpetas_drive.controller');
const { verificarToken } = require('../middleware/auth.middleware');

router.post('/crear', CarpetasDriveController.crear_carpeta);

module.exports = router;