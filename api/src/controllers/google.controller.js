const fs = require("fs");
const {
    oauth2Client,
    TOKEN_PATH
} = require("../config/google.auth");
const SCOPES = [
    "https://www.googleapis.com/auth/drive"
];

class GoogleController {
    static auth(req, res) {
        const url = oauth2Client.generateAuthUrl({
            access_type: "offline",
            scope: SCOPES,
            prompt: "consent"
        });
        res.redirect(url);
    }

    static async callback(req, res) {
        try {
            const code = req.query.code;
            const { tokens } = await oauth2Client.getToken(code);
            oauth2Client.setCredentials(tokens);
            fs.writeFileSync(
                TOKEN_PATH,
                JSON.stringify(tokens)
            );
            res.send(`
                <h2>Google Drive conectado correctamente</h2>
                <p>Token guardado.</p>
            `);
        } catch (error) {
            console.error(error);
            res.status(500).json({
                error: "Error al conectar Google Drive"
            });
        }
    }
}

module.exports = GoogleController;