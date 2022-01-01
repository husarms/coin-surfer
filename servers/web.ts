const express = require('express');
const path = require('path');

let backgroundProcessRunning = false;

export const startWebServer = (backgroundProcess: () => void, port?: string | number) => {
    const app = express();
    port = port ? port : process.env.PORT;
    app.use(express.static('web/dist'));
    app.get('/hello', function (req, res) {
        console.log("Received request to /hello");
        let didWeJustTurnOnBackgroundProcess = false;
        if (!backgroundProcessRunning) {
            backgroundProcess();
            backgroundProcessRunning = true;
            didWeJustTurnOnBackgroundProcess = true;
        }
        res.send(`Did we just turn on background process? ${didWeJustTurnOnBackgroundProcess}`);
    });
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../web/dist/index.html'));
    });
    app.listen(port, () => {
        console.log(`Web server started at http://${process.env.BASE_ADDRESS}:${port}`);
    });
}
