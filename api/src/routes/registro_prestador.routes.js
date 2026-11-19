const express = require("express");
const router = express.Router();
const Registro_Prestador_Controller = require('../controllers/registro_prestador.controller');

router.post('/registrar', Registro_Prestador_Controller.registrar);
router.get('/beneficiarios/:idCarpeta', Registro_Prestador_Controller.consultarBeneficiarios);

module.exports = router;