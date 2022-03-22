import * as TradeOrchestrator from "../../orchestrators/trade-orchestrator";

test("getBuySellThresholds returns thresholds", () => {
    const now = new Date();
    return TradeOrchestrator.getBuySellThresholds(100, 105, 4, 4).then(response => {
        expect(response).toStrictEqual({
            buyThreshold: 100.8,
            sellThreshold: 109.2,
        });
    })
});

