import { Actions } from "../utils/enums";
import TrendAnalysis from "./trend-analysis";
import SurfParameters from "./surf-parameters";

export default interface SurfState {
    parameters: SurfParameters;
    productId: string;
    action: Actions.Buy | Actions.Sell;
    price: number;
    averagePrice: number;
    trendAnalysis: TrendAnalysis;
    buyThreshold: number;
    buyThresholdPercentage: number;
    sellThreshold: number;
    sellThresholdPercentage: number;
    lastBuyPrice: number;
    lastBuyDate: Date;
    lastSellDate: Date;
    fiatBalance: number;
    cryptoBalance: number;
    statusMessage: string;
    timestamp: Date;
}
