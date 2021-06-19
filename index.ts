import * as SimpleThresholdSurfer from "./surfers/simple-threshold";
import { Products } from "./utils/enums";

(async () => {
    await SimpleThresholdSurfer.surf({
        fiatCurrency: Products.USDollar,
        cryptoCurrency: Products.Cardano,
        buyThresholdPercentage: 4,
        sellThresholdPercentage: 4,
        budget: 300,
        notificationsEnabled: true,
    });
    await SimpleThresholdSurfer.surf({
        fiatCurrency: Products.USDollar,
        cryptoCurrency: Products.Litecoin,
        buyThresholdPercentage: 4,
        sellThresholdPercentage: 4,
        budget: 300,
        notificationsEnabled: true,
    });
    await SimpleThresholdSurfer.surf({
        fiatCurrency: Products.USDollar,
        cryptoCurrency: Products.Bitcoin,
        buyThresholdPercentage: 5,
        sellThresholdPercentage: 5,
        budget: 300,
        notificationsEnabled: true,
    });
})();
