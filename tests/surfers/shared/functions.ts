import * as Formatters from "../../../utils/formatters";

export function getBuyThreshold(averagePrice: number, thresholdPercentage: number) {
    const threshold = averagePrice * (thresholdPercentage / 100);
    return Formatters.roundDownToTwoDecimals(averagePrice - threshold);
}

export function getSellThreshold(averagePrice: number, thresholdPercentage: number) {
    const threshold = averagePrice * (thresholdPercentage / 100);
    return Formatters.roundDownToTwoDecimals(averagePrice + threshold);
}