const express = require("express");
const router = express.Router();

const { GenerarIncidenciasBecariosController } = require("../../controllers/documentos/incidencias_becarios.controller");

router.post("/", GenerarIncidenciasBecariosController);

module.exports = router;