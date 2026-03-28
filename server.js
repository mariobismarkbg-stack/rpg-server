const http = require("http");
const WebSocket = require("ws");

const server = http.createServer((req, res) => {
    res.writeHead(200);
    res.end("Servidor activo");
});

const wss = new WebSocket.Server({ noServer: true });

server.on("upgrade", (request, socket, head) => {
    console.log("Upgrade request recibido");

    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit("connection", ws, request);
    });
});

wss.on("connection", (ws) => {
    console.log("Jugador conectado");

    ws.send("Conectado correctamente");

    ws.on("message", (msg) => {
        console.log("Mensaje:", msg.toString());
        ws.send("OK");
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log("Servidor corriendo en puerto " + PORT);
});
