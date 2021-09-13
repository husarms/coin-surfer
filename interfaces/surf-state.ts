import SurfParameters from "./surf-parameters";
import Fill from "./fill";
import { Actions } from '../utils/enums';

export default interface SurfState {
    action: Actions.Buy | Actions.Sell,
    parameters: SurfParameters,
    buyThreshold: number,
    sellThreshold: number,
    lastSellFill: Fill,
    lastBuyFill: Fill,
    lastUpdateTimestamp: Date,
}
