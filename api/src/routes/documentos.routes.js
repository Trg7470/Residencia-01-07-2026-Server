const express = require('express');
const router = express.Router();
const DocumentosController = require('../controllers/documentos.controller');

// Petición POST usada por el frontend (http://localhost:3000/api/documentos/registrar)
router.post('/registrar', DocumentosController.registrar);

// Consultas y operaciones adicionales
router.get('/count', DocumentosController.contar);
router.get('/:id', DocumentosController.obtenerPorId);
router.get('/carpeta/:idCarpeta', DocumentosController.obtenerPorCarpeta);
router.delete('/:id', DocumentosController.eliminar);

module.exports = router;