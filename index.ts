import * as SimpleThresholdSurfer from "./surfers/simple-threshold";
import { Buy, USDollar, Cardano, Litecoin } from "./utils/constants";

const surfParameters = {
    fiatCurrency: USDollar,
    cryptoCurrency: Cardano,
    buyThresholdPercentage: 4,
    sellThresholdPercentage: 4.5,
    budget: 2000,
};

(async () => {
    await SimpleThresholdSurfer.surf({
        fiatCurrency: USDollar,
        cryptoCurrency: Cardano,
        buyThresholdPercentage: 4,
        sellThresholdPercentage: 4.5,
        budget: 300,
    });
    await SimpleThresholdSurfer.surf({
        fiatCurrency: USDollar,
        cryptoCurrency: Litecoin,
        buyThresholdPercentage: 4,
        sellThresholdPercentage: 4.5,
        budget: 300,
    });
})();
