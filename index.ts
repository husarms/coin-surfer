import * as SimpleThresholdSurfer from "./surfers/simple-threshold";
import { Products } from "./utils/enums";

(async () => {
    await SimpleThresholdSurfer.surf({
        fiatCurrency: Products.USDollar,
        cryptoCurrency: Products.Etherium,
        buyThresholdPercentage: 4,
        sellThresholdPercentage: 4,
        budget: 16000,
        notificationsEnabled: true,
    });
    await SimpleThresholdSurfer.surf({
        fiatCurrency: Products.USDollar,
        cryptoCurrency: Products.Bitcoin,
        buyThresholdPercentage: 4,
        sellThresholdPercentage: 4,
        budget: 16000,
        notificationsEnabled: true,
    });
})();
