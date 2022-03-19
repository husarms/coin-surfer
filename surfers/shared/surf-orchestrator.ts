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
    uploadLogs,
} from "./functions";
import { Logger } from "../../utils/logger";
import { Actions } from "../../utils/enums";
import * as Formatters from "../../utils/formatters";
import * as WebSocketServer from "../../servers/web-socket";
import SurfState from "../../interfaces/surf-state";

export function updateLogs(logger: Logger) {
    uploadLogs(logger);
}

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
    const { isLocal, webSocketFeedEnabled } = parameters;
    state.statusMessage = getStatusMessage(state);
    state.timestamp = new Date();
    logger.log(state.statusMessage);
    if (webSocketFeedEnabled) WebSocketServer.emitMessage(state);
    if (!isLocal) uploadLogs(logger);
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

export async function updateThresholds(state: SurfState): Promise<SurfState> {
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
    const { buyThreshold, buyThresholdPercentage, sellThreshold, sellThresholdPercentage } = await getAiThresholds(state);
    state.buyThreshold = buyThreshold;
    state.buyThresholdPercentage = buyThresholdPercentage;
    state.sellThreshold = sellThreshold;
    state.sellThresholdPercentage = sellThresholdPercentage;
    return state;
}

function getAiThresholds(state: SurfState): { buyThreshold: number, buyThresholdPercentage: number, sellThreshold: number, sellThresholdPercentage: number, } {
    const { price, trendAnalysis } = state;
    const { sevenDayLowPrice, sevenDayHighPrice, thirtyDayLowPrice, thirtyDayHighPrice, sixtyDayLowPrice, sixtyDayHighPrice } = trendAnalysis;
    const smoothingPercentage = 1 / 100;
    const lowPriceAverage = (sevenDayLowPrice + thirtyDayLowPrice + sixtyDayLowPrice) / 3;
    const highPriceAverage = (sevenDayHighPrice + thirtyDayHighPrice + sixtyDayHighPrice) / 3;
    const lowPriceAverageWithSmoothing = lowPriceAverage + (lowPriceAverage * smoothingPercentage);
    const highPriceAverageWithSmoothing = highPriceAverage - (highPriceAverage * smoothingPercentage);
    const buyThreshold = Formatters.roundDownToTwoDecimals(lowPriceAverageWithSmoothing);
    const buyThresholdPercentage = Formatters.roundDownToOneDecimal(Math.abs(((price - buyThreshold) / price) * 100));
    const sellThreshold = Formatters.roundDownToTwoDecimals(highPriceAverageWithSmoothing);
    const sellThresholdPercentage = Formatters.roundDownToOneDecimal(Math.abs(((price - sellThreshold) / price) * 100));
    return { buyThreshold, buyThresholdPercentage, sellThreshold, sellThresholdPercentage };
}
