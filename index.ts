import SurfParameters from "./interfaces/surf-parameters";
import * as AiThresholdSurfer from "./surfers/ai-threshold";
import { Products } from "./utils/enums";
import * as WebSocketServer from "./servers/web-socket";
import * as WebServer from "./servers/web";
import { clearInterval } from "timers";

const isLocal = process.env.ENVIRONMENT === 'development';

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

let surfIntervals: NodeJS.Timer[] = [];

async function startSurfing() {
    if (surfIntervals.length > 0) {
        console.log(`${surfIntervals.length} surfer(s) already running, returning...`);
        return;
    }
    parameters.map(async (parameters) => {
        let interval = await AiThresholdSurfer.surf(parameters);
        surfIntervals.push(interval);
        console.log(`${surfIntervals.length} surfer(s) started`);
    });
}

async function stopSurfing() {
    if (surfIntervals.length <= 0) {
        console.log('No surfers to stop, returning...');
        return;
    }
    console.log(`Stopping ${surfIntervals.length} surfer(s)...`);
    surfIntervals.map(interval => {
        clearInterval(interval);
    });
    surfIntervals = [];
}

const webServer = WebServer.startWebServer(startSurfing, stopSurfing);
WebSocketServer.startWebSocketServer(webServer);

if (isLocal) {
    startSurfing();
}