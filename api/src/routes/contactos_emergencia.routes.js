const express = require('express');
const router = express.Router();
const ContactosEmergenciaController = require('../controllers/contactos_emergencia.controller');
const { verificarToken } = require('../middleware/auth.middleware');

router.post('/guardar', ContactosEmergenciaController.save);

module.exports = router