import * as SimpleThresholdSurfer from "./surfers/simple-threshold";
import { Products } from "./utils/enums";

(async () => {
    await SimpleThresholdSurfer.surf({
        fiatCurrency: Products.USDollar,
        cryptoCurrency: Products.Etherium,
        buyThresholdPercentage: 4,
        sellThresholdPercentage: 4,
        budget: 1000,
        notificationsEnabled: true,
        sellAtLoss: true,
    });
    await SimpleThresholdSurfer.surf({
        fiatCurrency: Products.USDollar,
        cryptoCurrency: Products.Bitcoin,
        buyThresholdPercentage: 4,
        sellThresholdPercentage: 3,
        budget: 1000,
        notificationsEnabled: true,
    });
})();
