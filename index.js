const simpleThresholdSurfer = require("./surfers/simple-threshold");
const constants = require("./utils/constants");

const surfParameters = {
    fiatCurrency: constants.USDollar,
    cryptoCurrency: constants.BitcoinCash,
    buyThresholdPercentage: 5,
    sellThresholdPercentage: 5,
    budget: 2000
};

(async () => {
    await simpleThresholdSurfer.surf(surfParameters);
})();
