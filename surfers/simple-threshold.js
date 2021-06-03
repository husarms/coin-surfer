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

    setInterval(async function () {
        const thresholds = await tradeOrchestrator.getBuySellThresholds(
            productId,
            buyThresholdPercentage,
            sellThresholdPercentage
        );
        const { buyThreshold, sellThreshold } = thresholds;
        const price = await tradeOrchestrator.getProductPrice(productId);
        const formattedDate = formatters.formatDate(new Date());
        const sellValue = (cryptoBalance * sellThreshold).toFixed(2);
        const buyBudget = fiatBalance > budget ? budget : fiatBalance;
        const buyValue = (buyBudget / buyThreshold).toFixed(2)
        const message = lookingToSell
            ? `looking to sell ${cryptoBalance} ${cryptoCurrency} at $${sellThreshold} ($${sellValue})`
            : `looking to buy $${buyBudget} worth of ${cryptoCurrency} at $${buyThreshold} (${buyValue})`;

        const averagePrice = await tradeOrchestrator.get24HrAveragePrice(productId);
        console.log(
            `${formattedDate}, ${averagePrice.toFixed(4)}, ${price.toFixed(4)}, - ${message} - current price = $${price.toFixed(4)}`
        );

        if (lookingToSell) {
            if (price >= sellThreshold) {
                console.log(
                    `Sell threshold hit (${price} >= ${sellThreshold})`
                );
                const size = cryptoBalance;
                console.log(
                    `Selling ${size} ${cryptoCurrency} at $${price}, ${fiatCurrency} value = $${
                        size * price
                    }`
                );
                const sellResponse = await tradeOrchestrator.sellAllAtMarketValue(
                    cryptoCurrency,
                    productId
                );
                console.log(`Sell complete. Response = ${JSON.stringify(sellResponse)}`);
                // await emailOrchestrator.sendSellNotification(size, cryptoCurrency, price, fiatCurrency);
                lookingToSell = false;
            }
        } else {
            if (price <= buyThreshold) {
                console.log(`Buy threshold hit (${price} <= ${buyThreshold})`);
                const size = tradeOrchestrator.getBuySize(fiatBalance, budget, price);
                console.log(
                    `Buying ${size} ${cryptoCurrency} at $${price}, ${fiatCurrency} value = $${
                        size * price
                    }`
                );
                const buyResponse = await tradeOrchestrator.buyAllAtMarketValue(
                    fiatCurrency,
                    budget,
                    price,
                    productId
                );
                console.log(`Buy complete. Response = ${JSON.stringify(buyResponse)}`);
                // await emailOrchestrator.sendBuyNotification(size, cryptoCurrency, price, fiatCurrency);
                lookingToSell = true;
            }
        }
    }, 10000);
};
