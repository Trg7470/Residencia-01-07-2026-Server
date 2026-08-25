const express = require('express');
const router = express.Router();
const TiposPersonalController = require('../controllers/tipos_personal.controller.js');

router.get('/all', TiposPersonalController.all);

module.exports = router;