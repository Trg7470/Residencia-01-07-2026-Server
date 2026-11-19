const express = require("express");
const router = express.Router();
const multer = require("multer");
const { GenerarGafeteController } = require("../../controllers/documentos/gafete.controller");
// Configuracion de almacenamiento temporal
const upload = multer({ dest: "uploads/" });

// Recibir fotografia y generar gafete
router.post("/", upload.single("Fotografia"), GenerarGafeteController);

module.exports = router;