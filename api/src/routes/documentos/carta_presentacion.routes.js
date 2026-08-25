const express = require("express");
const router = express.Router();

const { GenerarPresentacionController } = require("../../controllers/documentos/carta_presentacion.controller");

router.post("/", GenerarPresentacionController);

module.exports = router;