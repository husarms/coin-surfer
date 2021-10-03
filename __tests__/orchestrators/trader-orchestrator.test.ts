import * as TradeOrchestrator from "../../orchestrators/trade-orchestrator";
import * as Formatters from "../../utils/formatters";

test("getBuySellThresholds returns thresholds (last buy date = today)", () => {
    const now = new Date();
    return TradeOrchestrator.getBuySellThresholds(100, 105, 100, now, 4, 4).then(response => {
        expect(response).toStrictEqual({
            buyThreshold: 100.8,
            sellThreshold: 109.2,
        });
    })
});

test("getBuySellThresholds returns thresholds (last buy date = 4 days ago)", () => {
    const now = new Date();
    const fourDaysAgo = Formatters.addDays(now, -4);
    return TradeOrchestrator.getBuySellThresholds(100, 105, 100,  fourDaysAgo, 4, 4).then(response => {
        expect(response).toStrictEqual({
            buyThreshold: 100.8,
            sellThreshold: 108,
        });
    })
});
