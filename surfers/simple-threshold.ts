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
    defineState,
    saveState,
} from "./shared/functions";
import { Logger } from "../utils/logger";
import { Actions } from "../utils/enums";
import SurfParameters from "../interfaces/surf-parameters";
import SurfState from "../interfaces/surf-state";
import * as WebSocketServer from "../web-socket/server";

export async function surf(parameters: SurfParameters) {
    const { cryptoCurrency, fiatCurrency, budget, notificationsEnabled, webSocketFeedEnabled } =
        parameters;
    const productId = `${cryptoCurrency}-${fiatCurrency}`;
    const logger = new Logger(productId);
    const balances = await getBalances(fiatCurrency, cryptoCurrency);
    const { cryptoBalance } = balances;
    let action = cryptoBalance > 0.1 ? Actions.Sell : Actions.Buy;
    let state = await updateState(action, productId, parameters);

    console.log(`Let's go surfing with ${productId}...`);
    setInterval(async function () {
        const prices = await getPrices(productId);
        const { price, averagePrice } = prices;
        const { buyThreshold, sellThreshold } = await getThresholdData(
            price,
            averagePrice,
            state
        );
        state.buyThreshold = buyThreshold;
        state.sellThreshold = sellThreshold;
        const statusMessage = await getStatusMessage(prices, balances, state);
        logger.log(statusMessage);
        if (webSocketFeedEnabled) WebSocketServer.emitMessage(statusMessage);

        if (state.action === Actions.Sell) {
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
                    state = await updateState(
                        Actions.Buy,
                        productId,
                        parameters
                    );
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
                    state = await updateState(
                        Actions.Sell,
                        productId,
                        parameters
                    );
                }
            }
        }
        state = saveState(state);
    }, 10000);
}

async function updateState(
    action: Actions.Buy | Actions.Sell,
    productId: string,
    parameters: SurfParameters
): Promise<SurfState> {
    const { cryptoBalance, fiatBalance, lastBuyFill, lastSellFill, buyThreshold, sellThreshold } =
        await getAllData(productId, parameters);
    let state = defineState(
        action,
        parameters,
        cryptoBalance,
        fiatBalance,
        buyThreshold,
        sellThreshold,
        lastBuyFill,
        lastSellFill
    );
    return saveState(state);
}

async function getThresholdData(
    price: number,
    averagePrice: number,
    state: SurfState
) {
    const lastSellDate = state.lastSellFill.date;
    const lastBuyPrice = state.lastBuyFill.price;
    const { buyThresholdPercentage, sellThresholdPercentage } =
        state.parameters;
    const { buyThreshold, sellThreshold } = await getThresholds(
        price,
        averagePrice,
        lastSellDate,
        lastBuyPrice,
        buyThresholdPercentage,
        sellThresholdPercentage
    );
    return { buyThreshold, sellThreshold };
}

async function getAllData(productId: string, parameters: SurfParameters) {
    const { fiatCurrency, cryptoCurrency, buyThresholdPercentage, sellThresholdPercentage } = parameters;
    const balances = await getBalances(fiatCurrency, cryptoCurrency);
    const { fiatBalance, cryptoBalance } = balances;
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
        fiatBalance,
        cryptoBalance,
        lastBuyFill,
        lastSellFill,
        lastBuyPrice,
        lastSellDate,
        buyThreshold,
        sellThreshold,
    };
}
