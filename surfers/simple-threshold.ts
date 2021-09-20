import {
    getStatusMessage,
    sendBuyNotification,
    sendSellNotification,
    buy,
    sell,
    getBalances,
    getPrices,
    getThresholds,
    getLastFills,
} from "./shared/functions";
import { Logger } from "../utils/logger";
import { Actions } from "../utils/enums";
import SurfParameters from "../interfaces/surf-parameters";
import * as WebSocketServer from "../web-socket/server";

export async function surf(parameters: SurfParameters) {
    const { cryptoCurrency, fiatCurrency, budget, notificationsEnabled } =
        parameters;
    const productId = `${cryptoCurrency}-${fiatCurrency}`;
    const logger = new Logger(productId);
    const balances = await getBalances(fiatCurrency, cryptoCurrency);
    const { cryptoBalance } = balances;
    let action = cryptoBalance > 0.1 ? Actions.Sell : Actions.Buy;

    console.log(`Let's go surfing with ${productId}...`);
    setInterval(async function () {
        const {
            price,
            averagePrice,
            balances,
            lastBuyPrice,
            buyThreshold,
            sellThreshold,
        } = await getAllData(productId, parameters);
        const statusMessage = await getStatusMessage(
            price,
            averagePrice,
            action,
            balances,
            lastBuyPrice,
            buyThreshold,
            sellThreshold,
            parameters
        );
        logger.log(statusMessage);
        if (parameters.webSocketFeedEnabled) WebSocketServer.emitMessage(statusMessage);
        
        if (action === Actions.Sell) {
            if (price >= sellThreshold) {
                console.log(
                    `Sell threshold hit (${price} >= ${sellThreshold})`
                );
                const { isComplete, size } = await sell(
                    cryptoCurrency,
                    productId
                );
                if (isComplete) {
                    notificationsEnabled &&
                        sendSellNotification(
                            size,
                            cryptoCurrency,
                            price,
                            fiatCurrency
                        );
                    Actions.Buy;
                }
            }
        } else {
            if (price <= buyThreshold) {
                console.log(`Buy threshold hit (${price} <= ${buyThreshold})`);
                const { isComplete, size } = await buy(
                    fiatCurrency,
                    budget,
                    price,
                    productId
                );
                if (isComplete) {
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
        }
    }, 10000);
}

async function getAllData(productId: string, parameters: SurfParameters) {
    const {
        fiatCurrency,
        cryptoCurrency,
        buyThresholdPercentage,
        sellThresholdPercentage,
    } = parameters;
    const balances = await getBalances(fiatCurrency, cryptoCurrency);
    const { price, averagePrice } = await getPrices(productId);
    const { lastBuyFill, lastSellFill } = await getLastFills(productId);
    const lastBuyPrice = lastBuyFill.price;
    const lastSellDate = lastSellFill.date;
    const { buyThreshold, sellThreshold } = await getThresholds(
        price,
        averagePrice,
        lastSellDate,
        lastBuyPrice,
        buyThresholdPercentage,
        sellThresholdPercentage
    );
    return {
        price,
        averagePrice,
        balances,
        lastBuyPrice,
        buyThreshold,
        sellThreshold,
    };
}