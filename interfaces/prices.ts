import HistoricalAverages from "./historical-averages";

export default interface Prices {
    price: number;
    averagePrice: number;
    historicalAverages: HistoricalAverages;
}
