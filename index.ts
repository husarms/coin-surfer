import SurfParameters from "./interfaces/surf-parameters";
import * as SimpleThresholdSurfer from "./surfers/simple-threshold";
import { Products } from "./utils/enums";
import * as WebSocketServer from "./web-socket/server";

const parameters: SurfParameters[] = [
    {
        fiatCurrency: Products.USDollar,
        cryptoCurrency: Products.Bitcoin,
        buyThresholdPercentage: 4,
        sellThresholdPercentage: 4,
        budget: 50000,
        notificationsEnabled: true,
        webSocketFeedEnabled: true,
    },
    {
        fiatCurrency: Products.USDollar,
        cryptoCurrency: Products.Etherium,
        buyThresholdPercentage: 4,
        sellThresholdPercentage: 4,
        budget: 50000,
        notificationsEnabled: true,
        webSocketFeedEnabled: true,
    },
];

(async () => {
    parameters.map((parameters) => {
        SimpleThresholdSurfer.surf(parameters);
    });
    if (parameters.find((p) => p.webSocketFeedEnabled)) {
        WebSocketServer.startWebSocketServer(8080);
    }
})();
