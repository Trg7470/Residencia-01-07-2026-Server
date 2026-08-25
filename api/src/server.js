require('dotenv').config();
const http = require('http');
const app = require('./app');
const { connectMySQL } = require('./config/mysql.js');
const socket = require('./socket');
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

socket.initialize(server);

async function startServer() {
    try {
        await connectMySQL();
        
        server.listen(PORT, () => {
            console.log(`🚀 Servidor ejecutándose en el puerto ${PORT}`);
        });

    } catch (error) {

        console.error("❌ Error al iniciar el servidor.");
        console.error(error);

    }
}

startServer();