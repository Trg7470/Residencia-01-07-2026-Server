const express = require("express");
const router = express.Router();

const {GenerarGafeteController} = require("../../controllers/documentos/gafete.controller");


router.post("/", GenerarGafeteController);


module.exports = router;