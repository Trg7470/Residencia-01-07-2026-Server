const express = require('express');
const router = express.Router();
const DatosEscolaresController = require('../controllers/datos_escolares.controller');
const { verificarToken } = require('../middleware/auth.middleware');

router.post('/guardar',DatosEscolaresController.save);

module.exports = router;