const express = require('express');
const path = require('path');

let backgroundProcessRunning = false;
const port = process.env.PORT;

export function startWebServer (backgroundProcess: () => void) : any {
    return express()
        .use(express.static('web/dist'))
        .get('/hello',  (req, res) => {
            console.log("Received request to /hello");
            let didWeJustTurnOnBackgroundProcess = false;
            if (!backgroundProcessRunning) {
                backgroundProcess();
                backgroundProcessRunning = true;
                didWeJustTurnOnBackgroundProcess = true;
            }
            res.send(`Did we just turn on background process? ${didWeJustTurnOnBackgroundProcess}`);
        })
        .get('*', (req, res) => {
            res.sendFile(path.join(__dirname, '../web/dist/index.html'));
        })
        .listen(port, () => {
            console.log(`Web server started at http://${process.env.BASE_ADDRESS}:${port}`);
        });
};
