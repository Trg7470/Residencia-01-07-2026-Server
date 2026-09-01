const express = require('express');
const router = express.Router();
const ExpedientesController = require('../controllers/expedientes.controller');

router.get('/informacion_general/:id_carpeta', ExpedientesController.informacion_general);
router.get('/resume', ExpedientesController.listar);


module.exports = router;