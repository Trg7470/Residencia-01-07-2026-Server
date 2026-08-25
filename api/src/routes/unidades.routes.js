const express = require('express');
const router = express.Router();
const UnidadesController = require('../controllers/unidades.controller');
const { verificarToken } = require('../middleware/auth.middleware');

router.get('/', UnidadesController.all);

module.exports = router;    