import * as SimpleThresholdSurfer from "./surfers/simple-threshold";
import { Products } from "./utils/enums";
// import startWebSocketServer from "./websocket";

// import express = require('express');

// const app = express();
// app.get('/', (req, res) => {
//     res.send('Hello World')
// })
// app.listen(3000);

//startWebSocketServer();

(async () => {
    await SimpleThresholdSurfer.surf({
        fiatCurrency: Products.USDollar,
        cryptoCurrency: Products.Bitcoin,
        buyThresholdPercentage: 4,
        sellThresholdPercentage: 3,
        budget: 1000,
        notificationsEnabled: true,
    });
})();
