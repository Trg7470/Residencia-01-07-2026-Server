const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const TOKEN_PATH = path.join(__dirname, "token.json");
const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);
// Si ya existe un token guardado, lo carga automáticamente
if (fs.existsSync(TOKEN_PATH)) {
    const token = JSON.parse(
        fs.readFileSync(TOKEN_PATH, "utf8")
    );

    oauth2Client.setCredentials(token);
}
module.exports = {
    oauth2Client,
    TOKEN_PATH
};