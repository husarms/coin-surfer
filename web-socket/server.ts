import * as CoinbaseGateway from "../gateways/coinbase-gateway";

// Create web socket server
const WebSocket = require("ws");
let sockets = [];

export const startWebSocketServer = (port: number) => {
    const server = new WebSocket.Server({
        port,
    });
    server.on("connection", function (socket) {
        console.log("Web socket connection received");
        sockets.push(socket);
        socket.on("close", function () {
            console.log("Web socket connection closed");
            sockets = sockets.filter((s) => s !== socket);
        });
    });
}

export const emitTickerMessages = (productId: string) => {
    const callback = (tickerMessage: any) => {
        if (tickerMessage.type === "ticker") {
            sockets.forEach((s) => {
                s.send(JSON.stringify(tickerMessage));
            });
        }
    };
    CoinbaseGateway.listenToTickerFeed(productId, callback);
};
