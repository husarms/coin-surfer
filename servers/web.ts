const express = require('express');
const path = require('path');
const port = process.env.PORT;

export function startWebServer (startBackgroundProcess: () => void, stopBackgroundProcess:() => void) : any {
    return express()
        .use(express.static('web/dist'))
        .get('/start',  (req, res) => {
            startBackgroundProcess();
            res.send(`Background process started`);
        })
        .get('/stop',  (req, res) => {
            stopBackgroundProcess();
            res.send(`Background process stopped`);
        })
        .get('*', (req, res) => {
            res.sendFile(path.join(__dirname, '../web/dist/index.html'));
        })
        .listen(port, () => {
            console.log(`Web server listening at port ${port}`);
        });
};
