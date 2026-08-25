const { google } = require("googleapis");
const { oauth2Client } = require("./google.auth");

const drive = google.drive({
    version: "v3",
    auth: oauth2Client
});

module.exports = drive;