const express = require("express");
const router = express.Router();

const { GenerarConstanciaSSController } = require("../../controllers/documentos/carta_constancia_ss.controller");

router.post("/",GenerarConstanciaSSController);

module.exports = router;