const express = require('express');
const path = require('path');

export const startWebServer = (port?: string | number) => {
    const app = express();
    port = port ? port : process.env.PORT;
    app.use(express.static('web/dist'));
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '/web/dist/index.html'));
    });
    app.listen(port, () => {
        console.log(`Web server started at http://${process.env.BASE_ADDRESS}:${port}`);
    });
}
