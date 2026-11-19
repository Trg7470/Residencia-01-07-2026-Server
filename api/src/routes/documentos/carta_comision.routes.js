const express = require("express");
const router = express.Router();
const { GenerarCartaComisionController, ObtenerCartaComisionController, EliminarCartaComisionController, EliminarTemporalesCartaComisionController, ContarComisionesController } = require("../../controllers/documentos/carta_comision.controller");

router.post("/", GenerarCartaComisionController);
router.post("/limpiar_temporales", EliminarTemporalesCartaComisionController);
router.get("/contar/:idPersona", ContarComisionesController);
router.get("/:id", ObtenerCartaComisionController);
router.delete("/:id", EliminarCartaComisionController);

module.exports = router;