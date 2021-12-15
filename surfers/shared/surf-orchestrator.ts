import {
    getStatusMessage,
    sendBuyNotification,
    sendSellNotification,
    buy,
    sell,
    getBalances,
    getPrices,
    getThresholds,
    getTrendAnalysis,
    getLastFills,
} from "./functions";
import { Logger } from "../../utils/logger";
import { Actions } from "../../utils/enums";
import * as WebSocketServer from "../../web-socket/server";
import SurfState from "../../interfaces/surf-state";

export async function handleBuy(state: SurfState): Promise<SurfState> {
    const { parameters, price, buyThreshold } = state;
    const { notificationsEnabled } = parameters;
    console.log(`Buy threshold hit (${price} <= ${buyThreshold})`);
    const { isComplete, size } = await buy(state);
    if (isComplete) {
        notificationsEnabled &&
            sendBuyNotification(state, size);
        state.lastBuyDate = new Date();
        state.lastBuyPrice = price;
        state.action = Actions.Sell;
    }
    return state;
}

export async function handleSell(state: SurfState): Promise<SurfState> {
    const { parameters, price, sellThreshold } = state;
    const { notificationsEnabled } = parameters;
    console.log(`Sell threshold hit (${price} >= ${sellThreshold})`);
    const { isComplete, size } = await sell(state);
    if (isComplete) {
        notificationsEnabled &&
            sendSellNotification(state, size);
        state.lastSellDate = new Date();
        state.action = Actions.Buy;
    }
    return state;
}

export function updateStatus(state: SurfState, logger: Logger): SurfState {
    const { parameters } = state;
    const { webSocketFeedEnabled } = parameters;
    state.statusMessage = getStatusMessage(state);
    state.timestamp = new Date();
    logger.log(state.statusMessage);
    if (webSocketFeedEnabled) {
        WebSocketServer.emitMessage(state);
    }
    return state;
}

export async function updateBalances(state: SurfState): Promise<SurfState> {
    const { fiatCurrency, cryptoCurrency } = state.parameters;
    const balances = await getBalances(fiatCurrency, cryptoCurrency);
    state.cryptoBalance = balances.cryptoBalance;
    state.fiatBalance = balances.fiatBalance;
    return state;
}

export async function updateFills(state: SurfState): Promise<SurfState> {
    const { productId } = state;
    const { lastBuyFill, lastSellFill } = await getLastFills(productId);
    state.lastBuyPrice = lastBuyFill?.price;
    state.lastBuyDate = lastBuyFill?.date;
    state.lastSellDate = lastSellFill?.date;
    return state;
}

export async function updatePrices(state: SurfState): Promise<SurfState> {
    const { productId } = state;
    const { price, averagePrice } = await getPrices(productId);
    state.price = price;
    state.averagePrice = averagePrice;
    return state;
}

export async function updateTrendAnalysis(state: SurfState): Promise<SurfState> {
    const { productId } = state;
    const trendAnaylsis = await getTrendAnalysis(productId);
    state.trendAnalysis = trendAnaylsis;
    return state;
}

export async function updateThresholds(state: SurfState) : Promise<SurfState> {
    const {
        buyThresholdPercentage,
        sellThresholdPercentage,
    } = state.parameters;
    const { averagePrice, lastBuyPrice } = state;
    const { buyThreshold, sellThreshold } = await getThresholds(
        averagePrice,
        lastBuyPrice,
        buyThresholdPercentage,
        sellThresholdPercentage
    );
    state.buyThreshold = buyThreshold;
    state.buyThresholdPercentage = buyThresholdPercentage;
    state.sellThreshold = sellThreshold;
    state.sellThreshold = sellThresholdPercentage;
    return state;
}

export async function updateThresholdsWithAI(state: SurfState): Promise<SurfState> {
    const { buyThresholdPercentage, sellThresholdPercentage } = getAiThresholdsPercentages(state);
    const { averagePrice, lastBuyPrice } = state;
    const { buyThreshold, sellThreshold } = await getThresholds(
        averagePrice,
        lastBuyPrice,
        buyThresholdPercentage,
        sellThresholdPercentage
    );
    state.buyThreshold = buyThreshold;
    state.buyThresholdPercentage = buyThresholdPercentage;
    state.sellThreshold = sellThreshold;
    state.sellThresholdPercentage = sellThresholdPercentage;
    return state;
}

function getAiThresholdsPercentages(state: SurfState): any {
    const { trendAnalysis } = state;
    const { sevenDayLowThreshold, sevenDayHighThreshold } = trendAnalysis;
    const buyThresholdPercentage = Math.round(sevenDayLowThreshold * 10) / 10;
    const sellThresholdPercentage = Math.round(sevenDayHighThreshold * 10) / 10;
    return { buyThresholdPercentage, sellThresholdPercentage };
}