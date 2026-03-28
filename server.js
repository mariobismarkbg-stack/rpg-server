const http = require("http");
const fs = require("fs");
const path = require("path");
const WebSocket = require("ws");

const server = http.createServer((req, res) => {
    // servir index.html
    let filePath = path.join(__dirname, "index.html");

    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(500);
            res.end("Error cargando archivo");
        } else {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(content);
        }
    });
});

const wss = new WebSocket.Server({ noServer: true });

let players = {};

server.on("upgrade", (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit("connection", ws, request);
    });
});

wss.on("connection", (ws) => {
    const id = Math.random().toString(36).substr(2, 9);
    players[id] = { x: 1000, y: 1000 };

    ws.on("message", (msg) => {
        try {
            players[id] = JSON.parse(msg);
        } catch {}
    });

    ws.on("close", () => {
        delete players[id];
    });

    setInterval(() => {
        const data = JSON.stringify(players);
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(data);
            }
        });
    }, 100);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log("Servidor corriendo en puerto " + PORT);
});
