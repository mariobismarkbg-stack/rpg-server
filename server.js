let players = {};

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

    // enviar estado a todos cada 100ms
    setInterval(() => {
        const data = JSON.stringify(players);
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(data);
            }
        });
    }, 100);
});
