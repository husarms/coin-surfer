const simpleThresholdSurfer = require("./surfers/simple-threshold");
//const websocketSurfer = require("./surfers/websocket");
const constants = require("./utils/constants");
const emailOrchestrator = require("./orchestrators/email-orchestrator");

const surfParameters = {
    fiatCurrency: constants.USDollar,
    cryptoCurrency: constants.Cardano,
    buyThresholdPercentage: 4.5,
    sellThresholdPercentage: 4.5,
    budget: 2000
};

(async () => {
    //emailOrchestrator.sendSellNotification(1, 'ADA', 1, 'USD');
    await simpleThresholdSurfer.surf(surfParameters);
    //await websocketSurfer.surf(surfParameters);
})();
