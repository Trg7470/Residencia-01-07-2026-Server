const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');
const { verificarToken } = require('../middleware/auth.middleware');

//Autenticación
//Login de usuario
router.post('/login', AuthController.login);

module.exports = router;