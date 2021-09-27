import SurfParameters from "../interfaces/surf-parameters";
import SurfState from "../interfaces/surf-state";
import { Actions, Products } from "../utils/enums";
import * as Formatters from "../utils/formatters";

const surfParameters : SurfParameters = {
    fiatCurrency: Products.USDollar,
    cryptoCurrency: Products.Bitcoin,
    buyThresholdPercentage: 4,
    sellThresholdPercentage: 4,
    budget: 50000,
    notificationsEnabled: true,
    webSocketFeedEnabled: true,
}

const surfState : SurfState = {
    parameters: surfParameters,
    productId: 'BTC-USD',
    action: Actions.Buy,
    price: 45000,
    averagePrice: 46000,
    buyThreshold: 43000,
    sellThreshold: 48000,
    lastBuyPrice: 42000,
    lastBuyDate: Formatters.addDays(new Date(), -4),
    lastSellDate: Formatters.addDays(new Date(), -1),
    fiatBalance: 25000,
    cryptoBalance: 0
}

export default { surfParameters, surfState }
