const express = require("express");
const router = express.Router();
const { GenerarVacacionesBecariosController } = require("../../controllers/documentos/vacaciones_becarios.controller");

router.post("/", GenerarVacacionesBecariosController);

module.exports = router;
