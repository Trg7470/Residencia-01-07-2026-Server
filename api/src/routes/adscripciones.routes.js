const express = require('express');
const router = express.Router();
const AdscripcionesController = require('../controllers/adscripciones.controller');
const { verificarToken } = require('../middleware/auth.middleware');

router.post('/guardar', AdscripcionesController.save);
router.get('/comisiones/:id_persona', AdscripcionesController.listar_comisiones);
router.get('/cifrhs-principal/:id_persona', AdscripcionesController.obtener_cifrhs_principal);

module.exports = router;