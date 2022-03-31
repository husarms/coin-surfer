import * as AIThreshold from '../../surfers/ai-threshold';
import testObjects from '../test-objects';
import * as TradeOrchestrator from '../../orchestrators/trade-orchestrator';
import { Logger } from '../../utils/logger';
import { loadReplayData } from '../replay-data/replay-data-parser';
import SurfState from '../../interfaces/surf-state';
import ReplayData from '../replay-data/replay-data';

jest.mock("../../gateways/sendgrid-gateway", () => {
    return;
});

jest.mock("../../orchestrators/trade-orchestrator", () => ({
    ...jest.requireActual('../../orchestrators/trade-orchestrator') as {},
    getAccountBalances: jest.fn(() => Promise.resolve({ fiatBalance: 1, cryptoBalance: 1 })),
    getFills: jest.fn(() => Promise.resolve(testObjects.fills)),
    get24HrAveragePrice: jest.fn(() => Promise.resolve(1)),
    getTrendAnalysis: jest.fn(() => Promise.resolve(testObjects.trendAnalysis)),
    getProductPrice: jest.fn(() => Promise.resolve(1)),
    sellAtMarketValue: jest.fn(() => Promise.resolve(1)),
    buyAtMarketValue: jest.fn(() => Promise.resolve(1)),
}));

async function SurfReplayData(state: SurfState, logger: Logger, replayData: ReplayData[]): Promise<SurfState> {
    for (let data of replayData) {
        // Pass data to mocks
        (TradeOrchestrator.getAccountBalances as jest.Mock).mockResolvedValueOnce({ fiatBalance: data.fiatBalance, cryptoBalance: data.cryptoBalance });
        (TradeOrchestrator.getFills as jest.Mock).mockResolvedValueOnce(data.fills);
        (TradeOrchestrator.getProductPrice as jest.Mock).mockResolvedValueOnce(data.price);
        (TradeOrchestrator.get24HrAveragePrice as jest.Mock).mockResolvedValueOnce(data.averagePrice);
        (TradeOrchestrator.getTrendAnalysis as jest.Mock).mockResolvedValueOnce(data.trendAnalysis);
        // Run surf function
        state = await AIThreshold.surf(state, logger);
    }
    return state;
}

test('Surf replay', async () => {
    // Load replay data
    const replayData = await loadReplayData();
    console.log(`Replay data length = ${replayData.length}`);
    // Set parameters
    let parameters = testObjects.surfParameters;
    const cryptoCurrency = replayData[0].productId;
    parameters.cryptoCurrency = cryptoCurrency;
    // Initialize surfer
    let state = await AIThreshold.initializeState(parameters);
    let logger = new Logger(state.productId);
    state = await SurfReplayData(state, logger, replayData);
});


