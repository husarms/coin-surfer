import SurfParameters from "./interfaces/surf-parameters";
import * as SimpleThresholdSurfer from "./surfers/simple-threshold";
import { Products } from "./utils/enums";
import * as WebSocketServer from "./web-socket/server";

const parameterSet: SurfParameters[] = [
    {
        fiatCurrency: Products.USDollar,
        cryptoCurrency: Products.Etherium,
        buyThresholdPercentage: 4,
        sellThresholdPercentage: 4,
        budget: 50000,
        notificationsEnabled: true,
        tickerFeedEnabled: true,
    },
    {
        fiatCurrency: Products.USDollar,
        cryptoCurrency: Products.Bitcoin,
        buyThresholdPercentage: 4,
        sellThresholdPercentage: 4,
        budget: 50000,
        notificationsEnabled: true,
        tickerFeedEnabled: false,
    },
    {
        fiatCurrency: Products.USDollar,
        cryptoCurrency: Products.BitcoinCash,
        buyThresholdPercentage: 4,
        sellThresholdPercentage: 4,
        budget: 50000,
        notificationsEnabled: true,
        tickerFeedEnabled: false,
    },
];

(async () => {
    await parameterSet.map((parameters) => {
        SimpleThresholdSurfer.surf(parameters);
    });
    if (parameterSet.find((p) => p.tickerFeedEnabled)) {
        WebSocketServer.startWebSocketServer(8080);
        parameterSet.map((p) => {
            if (p.tickerFeedEnabled) {
                WebSocketServer.emitTickerMessages(
                    p.cryptoCurrency,
                    p.fiatCurrency
                );
            }
        });
    }
})();
