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
} from "./shared/functions";
import { Logger } from "../utils/logger";
import { Actions } from "../utils/enums";
import SurfParameters from "../interfaces/surf-parameters";
import SurfState from "../interfaces/surf-state";
import * as WebSocketServer from "../web-socket/server";

export async function surf(parameters: SurfParameters) {
    let state = {} as SurfState;
    state.parameters = parameters;
    state.productId = `${state.parameters.cryptoCurrency}-${state.parameters.fiatCurrency}`;
    const logger = new Logger(state.productId);
    state = await updateBalances(state);
    state.action = state.cryptoBalance > 0.1 ? Actions.Sell : Actions.Buy;

    console.log(`Let's go surfing with ${state.productId}...`);
    setInterval(async function () {
        state = await updateBalances(state);
        state = await updateFills(state);
        state = await updatePrices(state);
        state = await updateTrendAnalysis(state);
        state = await updateThresholds(state);
        state = updateStatus(state, logger);
        const { action, price, buyThreshold, sellThreshold } = state;
        if (action === Actions.Sell) {
            if (price >= sellThreshold) {
                console.log(
                    `Sell threshold hit (${price} >= ${sellThreshold})`
                );
                state = await handleSell(state);
            }
        } else {
            if (price <= buyThreshold) {
                console.log(`Buy threshold hit (${price} <= ${buyThreshold})`);
                state = await handleBuy(state);
            }
        }
    }, 10000);
}

async function handleBuy(state: SurfState) : Promise<SurfState> {
    const { parameters, price } = state;
    const { notificationsEnabled } = parameters;
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

async function handleSell(state: SurfState) : Promise<SurfState> {
    const { notificationsEnabled } = state.parameters;
    const { isComplete, size } = await sell(state);
    if (isComplete) {
        notificationsEnabled &&
            sendSellNotification(state, size);
        state.lastSellDate = new Date();
        state.action = Actions.Buy;
    }
    return state;
}

function updateStatus(state: SurfState, logger: Logger): SurfState {
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

async function updateBalances(state: SurfState): Promise<SurfState> {
    const { fiatCurrency, cryptoCurrency } = state.parameters;
    const balances = await getBalances(fiatCurrency, cryptoCurrency);
    state.cryptoBalance = balances.cryptoBalance;
    state.fiatBalance = balances.fiatBalance;
    return state;
}

async function updateFills(state: SurfState): Promise<SurfState> {
    const { productId } = state;
    const { lastBuyFill, lastSellFill } = await getLastFills(productId);
    state.lastBuyPrice = lastBuyFill?.price;
    state.lastBuyDate = lastBuyFill?.date;
    state.lastSellDate = lastSellFill?.date;
    return state;
}

async function updatePrices(state: SurfState): Promise<SurfState> {
    const { productId } = state;
    const { price, averagePrice } = await getPrices(productId);
    state.price = price;
    state.averagePrice = averagePrice;
    return state;
}

async function updateTrendAnalysis(state: SurfState): Promise<SurfState> {
    const { productId } = state;
    const trendAnaylsis = await getTrendAnalysis(productId);
    state.trendAnalysis = trendAnaylsis;
    return state;
}

async function updateThresholds(state: SurfState) : Promise<SurfState> {
    const {
        buyThresholdPercentage,
        sellThresholdPercentage,
    } = state.parameters;
    const { price, averagePrice, lastBuyPrice } = state;
    const { buyThreshold, sellThreshold } = await getThresholds(
        price,
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