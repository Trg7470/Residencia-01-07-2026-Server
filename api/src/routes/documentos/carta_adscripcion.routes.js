const express = require("express");
const router = express.Router();

const { GenerarAdscripcionController, EliminarTemporalesAdscripcionController } = require("../../controllers/documentos/carta_adscripcion.controller");

router.post("/",GenerarAdscripcionController);
router.post("/limpiar_temporales", EliminarTemporalesAdscripcionController);

module.exports = router;