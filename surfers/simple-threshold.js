import {
    logStatusMessage,
    getBalancesAndVerify,
    sendBuyNotification,
    sendSellNotification,
    buy,
    sell,
    getPrices,
    getThresholds,
} from "./shared/functions";

export async function surf(parameters) {
    console.log(`Let's go surfing...`);
    const {
        fiatCurrency,
        cryptoCurrency,
        buyThresholdPercentage,
        sellThresholdPercentage,
        budget,
    } = parameters;
    const productId = `${cryptoCurrency}-${fiatCurrency}`;
    const { fiatBalance } = await getBalancesAndVerify(
        fiatCurrency,
        cryptoCurrency
    );
    let lookingToSell = fiatBalance < 10;

    setInterval(async function () {
        const { buyThreshold, sellThreshold } = await getThresholds(
            productId,
            buyThresholdPercentage,
            sellThresholdPercentage
        );
        const { price, averagePrice } = await getPrices(productId);

        await logStatusMessage(
            price,
            averagePrice,
            buyThreshold,
            sellThreshold
        );

        if (lookingToSell) {
            if (price >= sellThreshold) {
                console.log(
                    `Sell threshold hit (${price} >= ${sellThreshold})`
                );
                const size = await sell(cryptoCurrency, productId);
                sendSellNotification(size, cryptoCurrency, price, fiatCurrency);
                lookingToSell = false;
            }
        } else {
            if (price <= buyThreshold) {
                console.log(`Buy threshold hit (${price} <= ${buyThreshold})`);
                const size = await buy(fiatCurrency, budget, price, productId);
                sendBuyNotification(size, cryptoCurrency, price, fiatCurrency);
                lookingToSell = true;
            }
        }
    }, 10000);
}
