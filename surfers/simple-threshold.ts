import {
    getStatusMessage,
    sendBuyNotification,
    sendSellNotification,
    buy,
    sell,
    getBalance,
    getPrices,
    getThresholds,
} from "./shared/functions";
import { Logger } from "../utils/logger";
import { Actions } from "../utils/enums";

export async function surf({
    fiatCurrency,
    cryptoCurrency,
    buyThresholdPercentage,
    sellThresholdPercentage,
    budget,
    notificationsEnabled,
    sellAtLoss = false,
}) {
    const productId = `${cryptoCurrency}-${fiatCurrency}`;
    const logger = new Logger(productId);
    const cryptoBalance = await getBalance(cryptoCurrency);
    let action = cryptoBalance > 0.001 ? Actions.Sell : Actions.Buy;

    console.log(`Let's go surfing with ${productId}...`);
    setInterval(async function () {
        const { buyThreshold, sellThreshold } = await getThresholds(
            productId,
            buyThresholdPercentage,
            sellThresholdPercentage,
            sellAtLoss
        );
        const { price, averagePrice } = await getPrices(productId);
        const statusMessage = await getStatusMessage(
            fiatCurrency,
            cryptoCurrency,
            budget,
            price,
            averagePrice,
            buyThreshold,
            buyThresholdPercentage,
            sellThreshold,
            sellThresholdPercentage,
            action
        );
        logger.log(statusMessage);

        if (action === Actions.Sell) {
            if (price >= sellThreshold) {
                console.log(
                    `Sell threshold hit (${price} >= ${sellThreshold})`
                );
                const size = await sell(cryptoCurrency, productId);
                notificationsEnabled &&
                    sendSellNotification(
                        size,
                        cryptoCurrency,
                        price,
                        fiatCurrency
                    );
                action = Actions.Buy;
            }
        } else {
            if (price <= buyThreshold) {
                console.log(`Buy threshold hit (${price} <= ${buyThreshold})`);
                const size = await buy(fiatCurrency, budget, price, productId);
                notificationsEnabled &&
                    sendBuyNotification(
                        size,
                        cryptoCurrency,
                        price,
                        fiatCurrency
                    );
                action = Actions.Sell;
            }
        }
    }, 10000);
}
