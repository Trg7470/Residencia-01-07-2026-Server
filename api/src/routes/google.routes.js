const express = require("express");
const router = express.Router();
const GoogleController = require("../controllers/google.controller");

router.get(
    "/auth",
    GoogleController.auth
);

router.get(
    "/oauth2callback",
    GoogleController.callback
);

module.exports = router;