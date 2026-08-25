const express = require('express');
const router = express.Router();
const DatosPersonalesController = require('../controllers/datos_personales.controller');
const { verificarToken } = require('../middleware/auth.middleware');

router.post('/guardar',DatosPersonalesController.guardar_datos);

module.exports = router;