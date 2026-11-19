const express = require("express");
const router = express.Router();
const { GenerarCartaConfidencialidadController, EliminarTemporalesCartaConfidencialidadController } = require("../../controllers/documentos/carta_confidencialidad.controller");

router.post("/", GenerarCartaConfidencialidadController);
router.post("/limpiar_temporales", EliminarTemporalesCartaConfidencialidadController);

module.exports = router;