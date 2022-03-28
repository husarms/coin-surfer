import { Fill, OrderSide, PaginatedData } from "coinbase-pro-node";
import SurfParameters from "../interfaces/surf-parameters";
import SurfState from "../interfaces/surf-state";
import TrendAnalysis from "../interfaces/trend-analysis";
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
    isLocal: true,
}

const trendAnalysis: TrendAnalysis = {
    sevenDayAverage: 45000,
    sevenDayHighPrice: 47000,
    sevenDayLowPrice: 43000,
    thirtyDayAverage: 45000,
    thirtyDayHighPrice: 47000,
    thirtyDayLowPrice: 43000,
    sixtyDayAverage: 45000,
    sixtyDayHighPrice: 47000,
    sixtyDayLowPrice: 43000,
    ninetyDayAverage: 45000,
    ninetyDayHighPrice: 47000,
    ninetyDayLowPrice: 43000,
    oneTwentyDayAverage: 45000,
    oneTwentyDayHighPrice: 47000,
    oneTwentyDayLowPrice: 43000,
}

const fills : PaginatedData<Fill> = {
    data: [{
        created_at: '',
        fee: '',
        liquidity: null,
        order_id: '',
        price: '',
        product_id: '',
        profile_id: '',
        settled: true,
        side: OrderSide.BUY,
        size: '',
        trade_id: 0,
        usd_volume: '',
        user_id: '',
    },
    {
        created_at: '',
        fee: '',
        liquidity: null,
        order_id: '',
        price: '',
        product_id: '',
        profile_id: '',
        settled: true,
        side: OrderSide.SELL,
        size: '',
        trade_id: 0,
        usd_volume: '',
        user_id: '',
    }],
    pagination: {
        after: '',
        before: ''
    }
};

const surfState : SurfState = {
    parameters: surfParameters,
    productId: 'BTC-USD',
    action: Actions.Buy,
    price: 45000,
    averagePrice: 46000,
    buyThreshold: 43000,
    buyThresholdPercentage: 5,
    sellThreshold: 48000,
    sellThresholdPercentage: 5,
    lastBuyPrice: 42000,
    lastBuyDate: Formatters.addDays(new Date(), -4),
    lastSellDate: Formatters.addDays(new Date(), -1),
    fiatBalance: 25000,
    cryptoBalance: 0,
    trendAnalysis,
    statusMessage: '',
    timestamp: new Date()
}

export default { fills, surfParameters, surfState, trendAnalysis }
