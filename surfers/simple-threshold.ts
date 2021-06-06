import {
    logStatusMessage,
    sendBuyNotification,
    sendSellNotification,
    buy,
    sell,
    getPrices,
    getThresholds,
} from "./shared/functions";
import { Buy, Sell } from "../utils/constants";

export async function surf(parameters) {
    const {
        fiatCurrency,
        cryptoCurrency,
        buyThresholdPercentage,
        sellThresholdPercentage,
        budget,
        initialIntent,
    } = parameters;
    const productId = `${cryptoCurrency}-${fiatCurrency}`;
    let intent= initialIntent;

    console.log(`Let's go surfing with ${productId}...`);
    setInterval(async function () {
        const { buyThreshold, sellThreshold } = await getThresholds(
            productId,
            buyThresholdPercentage,
            sellThresholdPercentage
        );
        const { price, averagePrice } = await getPrices(productId);

        await logStatusMessage(
            fiatCurrency,
            cryptoCurrency,
            budget,
            price,
            averagePrice,
            buyThreshold,
            sellThreshold,
            intent,
        );

        if (intent === Sell) {
            if (price >= sellThreshold) {
                console.log(
                    `Sell threshold hit (${price} >= ${sellThreshold})`
                );
                const size = await sell(cryptoCurrency, productId);
                sendSellNotification(size, cryptoCurrency, price, fiatCurrency);
                intent = Buy;
            }
        } else {
            if (price <= buyThreshold) {
                console.log(`Buy threshold hit (${price} <= ${buyThreshold})`);
                const size = await buy(fiatCurrency, budget, price, productId);
                sendBuyNotification(size, cryptoCurrency, price, fiatCurrency);
                intent = Sell;
            }
        }
    }, 10000);
}
