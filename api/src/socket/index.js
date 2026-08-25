const { Server } = require("socket.io");
let io = null;

function initialize(server) {

    io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", (socket) => {

        console.log(`🟢 Cliente conectado: ${socket.id}`);

        socket.on("disconnect", () => {

            console.log(`🔴 Cliente desconectado: ${socket.id}`);

        });
    });

}

function getIO() {

    if (!io) {
        throw new Error("Socket.IO aún no ha sido inicializado.");
    }

    return io;

}

module.exports = {
    initialize,
    getIO
};