import * as SimpleThresholdSurfer from "./surfers/simple-threshold";
import { Products } from "./utils/enums";
import * as WebSocketServer from "./web-socket/server";

(async () => {
    await SimpleThresholdSurfer.surf({
        fiatCurrency: Products.USDollar,
        cryptoCurrency: Products.Etherium,
        buyThresholdPercentage: 4,
        sellThresholdPercentage: 4,
        budget: 50000,
        notificationsEnabled: true,
    });
    await SimpleThresholdSurfer.surf({
        fiatCurrency: Products.USDollar,
        cryptoCurrency: Products.Bitcoin,
        buyThresholdPercentage: 4,
        sellThresholdPercentage: 4,
        budget: 50000,
        notificationsEnabled: true,
    });
    await SimpleThresholdSurfer.surf({
        fiatCurrency: Products.USDollar,
        cryptoCurrency: Products.BitcoinCash,
        buyThresholdPercentage: 4,
        sellThresholdPercentage: 4,
        budget: 50000,
        notificationsEnabled: true,
    });
})();

WebSocketServer.startWebSocketServer(8080);
WebSocketServer.emitTickerMessages("ETH-USD");
