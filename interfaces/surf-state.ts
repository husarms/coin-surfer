import { Actions } from "../utils/enums";
import SurfParameters from "./surf-parameters";

export default interface SurfState {
    parameters: SurfParameters;
    productId: string;
    action: Actions.Buy | Actions.Sell;
    price: number;
    averagePrice: number;
    buyThreshold: number;
    sellThreshold: number;
    lastBuyPrice: number;
    lastSellDate: Date;
    fiatBalance: number;
    cryptoBalance: number;
}
