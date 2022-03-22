import {
    handleBuy,
    handleSell,
    updateBalances,
    updateFills,
    updatePrices,
    updateStatus,
    updateThresholdsWithAI,
    updateTrendAnalysis
} from "./shared/surf-orchestrator";
import { Logger } from "../utils/logger";
import { Actions } from "../utils/enums";
import SurfParameters from "../interfaces/surf-parameters";
import SurfState from "../interfaces/surf-state";

export async function startSurfing(parameters: SurfParameters): Promise<NodeJS.Timer> {
    let state = await initializeState(parameters);
    const logger = new Logger(state.productId);
    console.log(`Let's go AI threshold surfing with ${state.productId}...`);
    return setInterval(async function () {
        state = await surf(state, logger);
    }, 10000);
}

export async function initializeState(parameters: SurfParameters): Promise<SurfState> {
    let state = {} as SurfState;
    state.parameters = parameters;
    state.productId = `${state.parameters.cryptoCurrency}-${state.parameters.fiatCurrency}`;
    state = await updateBalances(state);
    state.action = state.cryptoBalance > 0.1 ? Actions.Sell : Actions.Buy;
    return state;
}

export async function surf(state: SurfState, logger: Logger): Promise<SurfState> {
    state = await updateBalances(state);
    state = await updateFills(state);
    state = await updatePrices(state);
    state = await updateTrendAnalysis(state);
    state = await updateThresholdsWithAI(state);
    state = updateStatus(state, logger);
    const { action, price, buyThreshold, sellThreshold } = state;
    if (action === Actions.Sell) {
        if (price >= sellThreshold) {
            state = await handleSell(state);
        }
    } else {
        if (price <= buyThreshold) {
            state = await handleBuy(state);
        }
    }
    return state;
}