import * as CoinbaseGateway from "../gateways/coinbase-gateway";

const WebSocket = require("ws");
let sockets = [];
let messages = [];
let websocketUrl = "";

export const startWebSocketServer = (port: number) => {
    const server = new WebSocket.Server({
        port,
    });
    websocketUrl = `ws://${process.env.BASE_ADDRESS}:${port}/ws`;
    server.on("connection", (socket) => {
        sockets.push(socket);
        socket.send(JSON.stringify(messages));
        socket.on("close", () => {
            sockets = sockets.filter((s) => s !== socket);
        });
    });
    console.log(`Web socket server started at ${websocketUrl}`);
}

export const emitTickerMessages = (cryptoCurrency: string, fiatCurrency: string) => {
    const productId = `${cryptoCurrency}-${fiatCurrency}`;
    console.log(`Emitting ticker messages for ${productId} at ${websocketUrl}`);
    const callback = (tickerMessage: any) => {
        if (tickerMessage.type === "ticker") {
            sockets.forEach((s) => {
                s.send(JSON.stringify(tickerMessage));
            });
        }
    };
    CoinbaseGateway.listenToTickerFeed(productId, callback);
};

const addMessageToQueue = (object: object) => {
    messages.push(object);
    if (messages.length > 1000) {
        messages.shift();
    }
};

export const emitMessage = (object: object) => {
    let copiedObject: object = {};
    Object.assign(copiedObject, object);
    addMessageToQueue(copiedObject);
    sockets.forEach((s) => {
        s.send(JSON.stringify([copiedObject]));
    });
};