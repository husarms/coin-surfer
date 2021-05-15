const tradeOrchestrator = require("./orchestrators/trade-orchestrator");
const formatters = require("./utils/formatters");
const constants = require("./utils/constants");

(async () => {
    console.log(`Let's go surfing...`);
    const fiatCurrency = constants.USDollar;
    const cryptoCurrency = constants.BitcoinCash;
    const productId = `${cryptoCurrency}-${fiatCurrency}`;
    const buyThresholdPercentage = 5;
    const sellThresholdPercentage = 5;
    const accountBalances = await tradeOrchestrator.getAccountBalances(
        fiatCurrency,
        cryptoCurrency
    );
    const { fiatBalance, cryptoBalance } = accountBalances;
    let lookingToSell = fiatBalance < 10;

    console.log(
        `Current fiat balance = $${fiatBalance} ${fiatCurrency}, crypto balance = ${cryptoBalance} ${cryptoCurrency}`
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
        const sellValue = cryptoBalance * sellThreshold;
        const message = lookingToSell
            ? `looking to sell ${cryptoBalance} ${cryptoCurrency} at $${sellThreshold} ($${sellValue})`
            : `looking to buy ${cryptoCurrency} at ${buyThreshold}`;

        console.log(
            `${formattedDate} - ${message} - current price = $${price}`
        );

        if (lookingToSell) {
            if (price >= sellThreshold) {
                console.log(
                    `Sell threshold hit (${price} >= ${sellThreshold})`
                );
                await tradeOrchestrator.sellAllAtMarketValue(
                    cryptoCurrency,
                    productId
                );
                lookingToSell = false;
            }
        } else {
            if (price <= buyThreshold) {
                console.log(`Buy threshold hit (${price} <= ${buyThreshold})`);
                await tradeOrchestrator.buyAllAtMarketValue(
                    fiatCurrency,
                    price,
                    productId
                );
                lookingToSell = true;
            }
        }
    }, 10000);
})();
