const express = require("express");
const router = express.Router();
const { GenerarIncidenciasBecariosController, EliminarTemporalesIncidenciasController } = require("../../controllers/documentos/incidencias_becarios.controller");

// Generar incidencia y subir PDF a Google Drive
router.post("/", GenerarIncidenciasBecariosController);

// Eliminar archivos temporales después del registro en MySQL
router.post("/limpiar_temporales", EliminarTemporalesIncidenciasController);

module.exports = router;