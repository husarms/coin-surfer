import { mocked } from 'ts-jest/utils';
import * as AIThreshold from '../../surfers/ai-threshold';
import testObjects from '../test-objects';
import { 
    getAccountBalance, 
    getFills, 
    get24HrAveragePrice, 
    getTrendAnalysis, 
    getProductPrice, 
    sellAtMarketValue, 
    buyAtMarketValue
} from '../../orchestrators/trade-orchestrator';
import {
    Fill,
    OrderSide,
    PaginatedData,
} from "coinbase-pro-node";
import TrendAnalysis from '../../interfaces/trend-analysis';
import { Logger } from '../../utils/logger';
import DataModel from '../data/data-model';

let fills = testObjects.fills;
let trendAnalysis = testObjects.trendAnalysis;

jest.mock("../orchestrators/trade-orchestrator", () => ({
    ...jest.requireActual('../orchestrators/trader-orchestrator') as {},
    getAccountBalance: (currency: string): Promise<number> => {
        return Promise.resolve(1);
    },
    getFills: (productId: string): Promise<PaginatedData<Fill>> => {
        return Promise.resolve(fills);
    },
    get24HrAveragePrice: (productId: string): Promise<number> => {
        return Promise.resolve(1);
    },
    getTrendAnalysis: (productId: string): Promise<TrendAnalysis> => {
        return Promise.resolve(trendAnalysis);
    },
    getProductPrice: (productId: string): Promise<number> => {
        return Promise.resolve(1);
    },
    sellAtMarketValue: (productId: string, size: string): Promise<number> => {
        return Promise.resolve(1);
    },
    buyAtMarketValue: (fiatBalance: number, budget: number, price: number, productId: string): Promise<number> => {
        return Promise.resolve(1);
    },
}));

function loadReplayData(): DataModel[] {
    let data: DataModel[] = [];

    return data;
}

test('Surf replay', async () => {
    // Load replay data
    const replayData = loadReplayData();
    // Initialize surfer
    let state = await AIThreshold.initializeState(testObjects.surfParameters);
    let logger = new Logger(state.productId);
    // Loop through saved data
    for(let data of replayData) {
        // Get values at current index

        // Pass to mocks
        mocked(getAccountBalance).mockResolvedValueOnce(data.fiatBalance);
        mocked(getFills).mockResolvedValueOnce(fills);
        mocked(getProductPrice).mockResolvedValueOnce(data.price);
        mocked(get24HrAveragePrice).mockResolvedValueOnce(data.averagePrice);
        mocked(getTrendAnalysis).mockResolvedValueOnce(trendAnalysis);
        // Run surf function
        state = await AIThreshold.surf(state, logger); 
    }
});


