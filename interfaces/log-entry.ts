import { Actions } from '../utils/enums';

export default interface LogEntry {
    fiatCurrency: string;
    cryptoCurrency: string;
    budget: number;
    price: number;
    averagePrice: number;
    lastBuyPrice: number;
    buyThreshold: number;
    buyThresholdPercentage: number;
    sellThreshold: number;
    sellThresholdPercentage: number;
    action: Actions.Sell | Actions.Buy;
}
