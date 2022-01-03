import SurfState from "../../../interfaces/surf-state";
import { Actions } from "../../../utils/enums";
import { formatNumber, formatRoughNumber } from "./formatters";
import { ProductPageProps } from "../pages/ProductPage";

const MAX_DATA_POINTS = 100000;

export function MapSurfStatesToProductMap(productMap: Map<string, ProductPageProps>, surfStates: SurfState[]) : Map<string, ProductPageProps> {
    let map = productMap;
    for (let surfState of surfStates) {
        const { parameters, timestamp, price, averagePrice, trendAnalysis, buyThreshold, sellThreshold, statusMessage, action } = surfState;
        const { ninetyDayAverage, ninetyDayLowPrice, ninetyDayHighPrice, sixtyDayAverage, sixtyDayLowPrice, sixtyDayHighPrice, thirtyDayAverage, thirtyDayLowPrice, thirtyDayHighPrice, sevenDayAverage, sevenDayLowPrice, sevenDayHighPrice } = trendAnalysis;
        const product = parameters.cryptoCurrency;
        const threshold = action === Actions.Buy ? buyThreshold : sellThreshold;
        let value = map.get(product);
        let priceData = value?.priceData;
        if (priceData) {
            priceData.push({ value: price, date: new Date(timestamp) });
            if (priceData.length >= MAX_DATA_POINTS) priceData.shift();
        } else {
            priceData = [];
        }
        let averageData = value?.averageData;
        if (averageData) {
            averageData.push({ value: averagePrice, date: new Date(timestamp) });
            if (averageData.length >= MAX_DATA_POINTS) averageData.shift();
        } else {
            averageData = [];
        }
        let sevenDayAverageData = value?.sevenDayAverageData;
        if (sevenDayAverageData) {
            sevenDayAverageData.push({ value: sevenDayAverage, date: new Date(timestamp) });
            if (sevenDayAverageData.length >= MAX_DATA_POINTS) sevenDayAverageData.shift();
        } else {
            sevenDayAverageData = [];
        }
        let thirtyDayAverageData = value?.thirtyDayAverageData;
        if (thirtyDayAverageData) {
            thirtyDayAverageData.push({ value: thirtyDayAverage, date: new Date(timestamp) });
            if (thirtyDayAverageData.length >= MAX_DATA_POINTS) thirtyDayAverageData.shift();
        } else {
            thirtyDayAverageData = [];
        }
        let thresholdData = value?.thresholdData;
        if (thresholdData) {
            thresholdData.push({ value: threshold, date: new Date(timestamp) });
            if (thresholdData.length >= MAX_DATA_POINTS) thresholdData.shift();
        } else {
            thresholdData = [];
        }
        const sevenDayTrend = formatTrendAnalysis(sevenDayAverage, sevenDayLowPrice, sevenDayHighPrice);
        const thirtyDayTrend = formatTrendAnalysis(thirtyDayAverage, thirtyDayLowPrice, thirtyDayHighPrice);
        const sixtyDayTrend = formatTrendAnalysis(sixtyDayAverage, sixtyDayLowPrice, sixtyDayHighPrice);
        const ninetyDayTrend = formatTrendAnalysis(ninetyDayAverage, ninetyDayLowPrice, ninetyDayHighPrice);
        const thresholdMargin = Math.abs(((sellThreshold - buyThreshold) / sellThreshold) * 100);
        const thresholdSummary = `$${formatRoughNumber(buyThreshold)} - $${formatRoughNumber(sellThreshold)} (${formatNumber(thresholdMargin)}%)`;
        const trendPrediction = getTrendPrediction(sevenDayAverage, thirtyDayAverage, sixtyDayAverage, ninetyDayAverage);
        map.set(product, {
            product: product,
            timestamp,
            price: formatNumber(price),
            priceData,
            average: formatNumber(averagePrice),
            averageData,
            sevenDayAverage: formatNumber(sevenDayAverage),
            sevenDayAverageData,
            thirtyDayAverage: formatNumber(thirtyDayAverage),
            thirtyDayAverageData,
            threshold: thresholdSummary,
            thresholdData,
            sevenDayTrend,
            thirtyDayTrend,
            sixtyDayTrend,
            ninetyDayTrend,
            trendPrediction,
            trendAnalysis,
            message: statusMessage,
        });
    }
    return map;
}

function formatTrendAnalysis(historicalAverage: number, lowPrice: number, highPrice: number): string {
    return `$${formatRoughNumber(lowPrice)} - $${formatRoughNumber(highPrice)} ($${formatRoughNumber(historicalAverage)})`;
}

function getTrendPrediction(sevenDayAverage: number, thirtyDayAverage: number, sixtyDayAverage: number, ninetyDayAverage: number): string {
    const sevenDayDifference = ((sevenDayAverage - thirtyDayAverage) / sevenDayAverage) * 100;
    const thirtyDayDifference = ((thirtyDayAverage - sixtyDayAverage) / thirtyDayAverage) * 100;
    const sixtyDayDifference = ((sixtyDayAverage - ninetyDayAverage) / sixtyDayAverage) * 100;
    let tide = 'N/A';
    // Leveling out
    if(Math.abs(sevenDayDifference) < 5) {
        // previous drop
        if(thirtyDayDifference < -5) tide = 'Low Tide';
        // previous rise
        if(thirtyDayDifference > 5) tide = 'High Tide';
    } else {
        // currently rising
        if(sevenDayDifference > 5) tide = 'Rising Tide';
        // currently falling
        if(sevenDayDifference < -5) tide = 'Falling Tide'
    }
    return tide;
}