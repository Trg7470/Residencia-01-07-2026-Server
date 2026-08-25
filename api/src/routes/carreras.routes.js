const express = require('express');
const router = express.Router();
const CarrerasController = require('../controllers/carreras.controller');
const { verificarToken } = require('../middleware/auth.middleware');

router.get('/', CarrerasController.all);
router.get('/:tipo', CarrerasController.type);

module.exports = router;