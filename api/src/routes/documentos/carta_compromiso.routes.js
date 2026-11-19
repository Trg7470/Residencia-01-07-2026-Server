const express = require("express");
const router = express.Router();
const { GenerarCartaCompromisoController, EliminarTemporalesCartaCompromisoController, ObtenerTipoParticipacionController } = require("../../controllers/documentos/carta_compromiso.controller");

router.post("/", GenerarCartaCompromisoController);
router.post("/limpiar_temporales", EliminarTemporalesCartaCompromisoController);
router.get("/participacion/:Id_Carpeta", ObtenerTipoParticipacionController);

module.exports = router;