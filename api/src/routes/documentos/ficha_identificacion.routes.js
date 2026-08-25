const express = require("express");
const router = express.Router();
const multer = require("multer");

// Configuración básica de almacenaje temporal
const upload = multer({ dest: "uploads/" }); 

const { GenerarFichaController } = require("../../controllers/documentos/ficha_identificacion.controller");

// Es VITAL agregar upload.single("foto") para procesar FormData y el archivo
router.post("/", upload.single("foto"), GenerarFichaController);

module.exports = router;