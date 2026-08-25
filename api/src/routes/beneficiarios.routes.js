const express = require('express');
const router = express.Router();
const BeneficiariosController = require('../controllers/beneficiarios.controller');
const { verificarToken } = require('../middleware/auth.middleware');

router.post('/guardar',BeneficiariosController.save);

module.exports = router;