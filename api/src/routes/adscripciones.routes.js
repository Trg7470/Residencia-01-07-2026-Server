const express = require('express');
const router = express.Router();
const AdscripcionesController = require('../controllers/adscripciones.controller');
const { verificarToken } = require('../middleware/auth.middleware');

router.post('/guardar', AdscripcionesController.save);

module.exports = router;
