const http = require("http");
const WebSocket = require("ws");

const server = http.createServer((req, res) => {
    res.writeHead(200);
    res.end("Servidor activo");
});

const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
    console.log("Jugador conectado");

    ws.on("message", (msg) => {
        console.log("Mensaje:", msg.toString());
        ws.send("Recibido: " + msg);
    });

    ws.send("Bienvenido al servidor");
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log("Servidor corriendo en puerto " + PORT);
});
