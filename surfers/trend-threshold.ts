import {
    getStatusMessage,
    sendBuyNotification,
    sendSellNotification,
    buy,
    sell,
    getBalance,
    getCurrentPercentage,
    getPrices,
    getThresholds,
} from "./shared/functions";
import { Logger } from "../utils/logger";
import { Actions } from "../utils/enums";

const intervalMs = 10000; // 10 seconds
const longTailLength = 10000; // 166 minutes
const shortTailLength = 500; //8.3 minutes
const longTail = [];
const shortTail = [];

function updateTails(price: number, averagePrice: number) {
    const currentPercentage = getCurrentPercentage(price, averagePrice);
    longTail.push(currentPercentage);
    shortTail.push(currentPercentage);
    if (longTail.length > longTailLength) longTail.pop();
    if (shortTail.length > shortTailLength) shortTail.pop();
}

function getShortTailTrend() {
    if (shortTail.length < shortTailLength) {
        return 0;
    }
    const latest = shortTail[0];
    const oldest = shortTail[shortTail.length - 1];
    return latest - oldest;
}

function getLongTailTrend() {
    if (longTail.length < longTailLength) {
        return 0;
    }
    const latest = longTail[0];
    const oldest = longTail[longTail.length - 1];
    return latest - oldest;
}

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
    let action = cryptoBalance > 0.1 ? Actions.Sell : Actions.Buy;

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
    }, intervalMs);
}
