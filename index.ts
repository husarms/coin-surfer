import * as SimpleThresholdSurfer from "./surfers/simple-threshold";
import { USDollar, Cardano, Litecoin } from "./utils/constants";

(async () => {
    await SimpleThresholdSurfer.surf({
        fiatCurrency: USDollar,
        cryptoCurrency: Cardano,
        buyThresholdPercentage: 4,
        sellThresholdPercentage: 4.5,
        budget: 300,
        notificationsEnabled: true,
    });
    await SimpleThresholdSurfer.surf({
        fiatCurrency: USDollar,
        cryptoCurrency: Litecoin,
        buyThresholdPercentage: 4,
        sellThresholdPercentage: 4.5,
        budget: 300,
        notificationsEnabled: true,
    });
})();
