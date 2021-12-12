import { Actions } from "../utils/enums";
import HistoricalAverages from "./historical-averages";
import SurfParameters from "./surf-parameters";

export default interface SurfState {
    parameters: SurfParameters;
    productId: string;
    action: Actions.Buy | Actions.Sell;
    price: number;
    averagePrice: number;
    historicalAverages: HistoricalAverages;
    buyThreshold: number;
    sellThreshold: number;
    lastBuyPrice: number;
    lastBuyDate: Date;
    lastSellDate: Date;
    fiatBalance: number;
    cryptoBalance: number;
    statusMessage: string;
    timestamp: Date;
}
