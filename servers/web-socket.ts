const { Server } = require('ws');

const MAX_MESSAGE_LENGTH = 1000;
let sockets = [];
let messages = [];

export const startWebSocketServer = (server: any) => {
    const wss = new Server({ server });
    wss.on("connection", (socket) => {
        sockets.push(socket);
        console.log(`Web socket connection added (${sockets.length} total)`);
        socket.send(JSON.stringify(messages));
        console.log(`Sent ${messages.length} message(s) to new connection`);
        socket.on("close", () => {
            sockets = sockets.filter((s) => s !== socket);
            console.log(`Web socket connection closed (${sockets.length} total)`);
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