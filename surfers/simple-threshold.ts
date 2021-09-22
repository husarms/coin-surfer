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
import SurfState from "../interfaces/surf-state";
import * as WebSocketServer from "../web-socket/server";

export async function surf(parameters: SurfParameters) {
    let state = {} as SurfState;
    state.parameters = parameters;
    state.productId = `${state.parameters.cryptoCurrency}-${state.parameters.fiatCurrency}`;
    const logger = new Logger(state.productId);
    state = await updateBalances(state);
    state = await updateFills(state);
    state.action = state.cryptoBalance > 0.1 ? Actions.Sell : Actions.Buy;

    console.log(`Let's go surfing with ${state.productId}...`);
    setInterval(async function () {
        state = await updatePricesBalancesThresholds(state);
        const { action, price, buyThreshold, sellThreshold } = state;
        reportStatus(state, logger);
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

function reportStatus(state: SurfState, logger: Logger) {
    const { parameters } = state;
    const { webSocketFeedEnabled } = parameters;
    const statusMessage = getStatusMessage(state);
    logger.log(statusMessage);
    if (webSocketFeedEnabled) { 
        WebSocketServer.emitMessage(statusMessage);
    }
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

async function updatePricesBalancesThresholds(state: SurfState) : Promise<SurfState> {
    const {
        fiatCurrency,
        cryptoCurrency,
        buyThresholdPercentage,
        sellThresholdPercentage,
    } = state.parameters;
    const { productId, lastBuyPrice } = state;
    const balances = await getBalances(fiatCurrency, cryptoCurrency);
    const { price, averagePrice } = await getPrices(productId);
    const { buyThreshold, sellThreshold } = await getThresholds(
        price,
        averagePrice,
        lastBuyPrice,
        buyThresholdPercentage,
        sellThresholdPercentage
    );
    state.price = price;
    state.averagePrice = averagePrice;
    state.cryptoBalance = balances.cryptoBalance;
    state.fiatBalance = balances.fiatBalance;
    state.buyThreshold = buyThreshold;
    state.sellThreshold = sellThreshold;
    return state;
}