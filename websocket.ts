import * as WebSocket from "ws";

const wss = new WebSocket.Server({ port: 8080 });
const clients = [];

export default function startWebSocketServer() {
    wss.on("connection", (ws) => {
        clients.push(ws);
        ws.on("message", (message) => {
            sendAll(message);
        });
    });
}

function sendAll(message: WebSocket.Data) {
    for (let client of clients) {
        client.send(message);
    }
}
