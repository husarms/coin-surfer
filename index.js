const tradeOrchestrator = require("./orchestrators/trade-orchestrator");
const formatters = require("./utils/formatters");
const constants = require("./utils/constants");

(async () => {
    const fiatCurrency = constants.USDollar;
    const cryptoCurrency = constants.BitcoinCash;
    const productId = `${cryptoCurrency}-${fiatCurrency}`;
    const buyThresholdPercentage = 5;
    const sellThresholdPercentage = 5;
    const accountBalances = await tradeOrchestrator.getAccountBalances(fiatCurrency, cryptoCurrency);
    const { fiatBalance, cryptoBalance } = accountBalances;
    let lookingToSell = fiatBalance < 10;

    console.log(`Current fiat balance = $${fiatBalance} (${fiatCurrency})`);
    console.log(
        `Looking to ${
            lookingToSell ? "sell" : "buy"
        } ${cryptoCurrency} (current balance = ${cryptoBalance})...`
    );

    const averagePriceInLast24Hrs = await tradeOrchestrator.get24HrAveragePrice(productId);
    console.log(
        `Average price for '${productId}' in last 24 hours = $${averagePriceInLast24Hrs}...`
    );

    const lastBuyPrice = await tradeOrchestrator.getLastBuyPrice(productId);
    console.log(
        `Last buy price for '${productId}'  = $${lastBuyPrice}...`
    );

    setInterval(async function () {      
        const thresholds = await tradeOrchestrator.getBuySellThresholds(productId, buyThresholdPercentage, sellThresholdPercentage);
        const { buyThreshold, sellThreshold } = thresholds;     
        const price = await tradeOrchestrator.getProductPrice(productId);

        console.log(
            `Current ${productId} price at ${formatters.formatDate(new Date())} = $${price} (buy @${buyThreshold}, sell @${sellThreshold})`
        );

        if (lookingToSell) {
            if (price >= sellThreshold) {
                console.log(
                    `Sell threshold hit (${price} >= ${sellThreshold})`
                );
                await tradeOrchestrator.sellAllAtMarketValue(cryptoCurrency, productId);
                lookingToSell = false;
            }
        } else {
            if (price <= buyThreshold) {
                console.log(`Buy threshold hit (${price} <= ${buyThreshold})`);
                await tradeOrchestrator.buyAllAtMarketValue(fiatCurrency, price, productId);
                lookingToSell = true;
            }
        }
    }, 10000);
})();
