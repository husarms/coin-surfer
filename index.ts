import SurfParameters from "./interfaces/surf-parameters";
import * as AiThresholdSurfer from "./surfers/ai-threshold";
import { Products } from "./utils/enums";
import * as WebSocketServer from "./servers/web-socket";
import * as WebServer from "./servers/web";

const parameters: SurfParameters[] = [
    {
        fiatCurrency: Products.USDollar,
        cryptoCurrency: Products.Bitcoin,
        buyThresholdPercentage: 5,
        sellThresholdPercentage: 10,
        budget: 50000,
        notificationsEnabled: true,
        webSocketFeedEnabled: true,
    },
    {
        fiatCurrency: Products.USDollar,
        cryptoCurrency: Products.Etherium,
        buyThresholdPercentage: 5,
        sellThresholdPercentage: 5,
        budget: 50000,
        notificationsEnabled: true,
        webSocketFeedEnabled: true,
    },
    {
        fiatCurrency: Products.USDollar,
        cryptoCurrency: Products.Litecoin,
        buyThresholdPercentage: 7,
        sellThresholdPercentage: 7,
        budget: 50000,
        notificationsEnabled: true,
        webSocketFeedEnabled: true,
    },
    {
        fiatCurrency: Products.USDollar,
        cryptoCurrency: Products.Cardano,
        buyThresholdPercentage: 7,
        sellThresholdPercentage: 7,
        budget: 50000,
        notificationsEnabled: true,
        webSocketFeedEnabled: true,
    },
];

const startSurfing = () => {
    parameters.map((parameters) => {
        AiThresholdSurfer.surf(parameters);
    });
}

WebServer.startWebServer(startSurfing, 5000);
WebSocketServer.startWebSocketServer(8080);

// (async () => {
//     parameters.map((parameters) => {
//         AiThresholdSurfer.surf(parameters);
//     });
//     if (parameters.find((p) => p.webSocketFeedEnabled)) {
//         WebSocketServer.startWebSocketServer(8080);
//     }
// })();
