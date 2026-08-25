const express = require("express");
const router = express.Router();

const {GenerarAdscripcionController} = require("../../controllers/documentos/carta_adscripcion.controller");

router.post("/",GenerarAdscripcionController);

module.exports = router;
