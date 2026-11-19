const express = require("express");
const router = express.Router();

const { GenerarConstanciaSSController, EliminarTemporalesConstanciaSSController } = require("../../controllers/documentos/carta_constancia_ss.controller");

router.post("/",GenerarConstanciaSSController);
router.post("/limpiar_temporales", EliminarTemporalesConstanciaSSController);

module.exports = router;