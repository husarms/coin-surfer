const { Server } = require('ws');

const MAX_MESSAGE_LENGTH = 1000;
let sockets = [];
let messages = [];

export const startWebSocketServer = (server: any) => {
    const wss = new Server({ server });
    wss.on("connection", (socket) => {
        sockets.push(socket);
        socket.send(JSON.stringify(messages));
        socket.on("close", () => {
            sockets = sockets.filter((s) => s !== socket);
        });
    });
    console.log(`Web socket server started`);
}

const addMessageToQueue = (object: object) => {
    messages.push(object);
    if (messages.length > MAX_MESSAGE_LENGTH) {
        messages.shift();
    }
};

export const getMessages = (): any[] => {
    return messages;
}

export const emitMessage = (object: object) => {
    let copiedObject: object = {};
    Object.assign(copiedObject, object);
    addMessageToQueue(copiedObject);
    sockets.forEach((s) => {
        s.send(JSON.stringify([copiedObject]));
    });
};