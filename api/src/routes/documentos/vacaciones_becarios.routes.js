const express = require("express");
const router = express.Router();
const { GenerarVacacionesBecariosController, EliminarTemporalesVacacionesController, ObtenerDisponibilidadVacacionesBecariosController } = require("../../controllers/documentos/vacaciones_becarios.controller");

router.post("/", GenerarVacacionesBecariosController);
router.get("/disponibilidad/:Id_Carpeta", ObtenerDisponibilidadVacacionesBecariosController);
router.post("/eliminar_temporales", EliminarTemporalesVacacionesController);

module.exports = router;