const tradeOrchestrator = require("../orchestrators/trade-orchestrator");
const emailOrchestrator = require("../orchestrators/email-orchestrator");
const formatters = require("../utils/formatters");

exports.surf = async function(parameters) {
    console.log(`Let's go surfing...`);
    const { fiatCurrency, cryptoCurrency, buyThresholdPercentage, sellThresholdPercentage, budget } = parameters;
    const productId = `${cryptoCurrency}-${fiatCurrency}`;
    const accountBalances = await tradeOrchestrator.getAccountBalances(
        fiatCurrency,
        cryptoCurrency
    );
    const { fiatBalance, cryptoBalance } = accountBalances;
    let lookingToSell = fiatBalance < 10;
    console.log(
        `Current ${fiatCurrency} balance = $${fiatBalance}, ${cryptoCurrency} balance = ${cryptoBalance}`
    );

    const getMessage = async (buyThreshold, sellThreshold) => {
        const accountBalances = await tradeOrchestrator.getAccountBalances(
            fiatCurrency,
            cryptoCurrency
        );
        const { fiatBalance, cryptoBalance } = accountBalances;
        const sellValue = (cryptoBalance * sellThreshold).toFixed(2);
        const buyBudget = fiatBalance > budget ? budget : fiatBalance;
        const buyValue = (buyBudget / buyThreshold).toFixed(2);

        return lookingToSell
            ? `looking to sell ${cryptoBalance} ${cryptoCurrency} at $${sellThreshold} ($${sellValue})`
            : `looking to buy $${buyBudget} worth of ${cryptoCurrency} at $${buyThreshold} (${buyValue})`;
    };

    setInterval(async function () {
        const thresholds = await tradeOrchestrator.getBuySellThresholds(
            productId,
            buyThresholdPercentage,
            sellThresholdPercentage
        );
        const { buyThreshold, sellThreshold } = thresholds;
        const price = await tradeOrchestrator.getProductPrice(productId);
        const averagePrice = await tradeOrchestrator.get24HrAveragePrice(productId);
        const message = await getMessage(buyThreshold, sellThreshold);
        const formattedDate = formatters.formatDate(new Date());

        console.log(
            `${formattedDate}, ${averagePrice.toFixed(4)}, ${price.toFixed(4)}, - ${message} - current price = $${price.toFixed(4)}`
        );

        if (lookingToSell) {
            if (price >= sellThreshold) {
                console.log(`Sell threshold hit (${price} >= ${sellThreshold})`);
                const sellResponse = await tradeOrchestrator.sellAllAtMarketValue(
                    cryptoCurrency,
                    productId
                );
                console.log(`Sell complete. Response = ${JSON.stringify(sellResponse)}`);
                emailOrchestrator.sendSellNotification(size, cryptoCurrency, price, fiatCurrency);
                lookingToSell = false;
            }
        } else {
            if (price <= buyThreshold) {
                console.log(`Buy threshold hit (${price} <= ${buyThreshold})`);
                const buyResponse = await tradeOrchestrator.buyAllAtMarketValue(
                    fiatCurrency,
                    budget,
                    price,
                    productId
                );
                console.log(`Buy complete. Response = ${JSON.stringify(buyResponse)}`);
                emailOrchestrator.sendBuyNotification(size, cryptoCurrency, price, fiatCurrency);
                lookingToSell = true;
            }
        }
    }, 10000);
};
