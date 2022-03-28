import {
    Candle,
    Fill,
    Order,
    OrderStatus,
    PaginatedData,
    PendingOrder,
    ProductStats,
    ProductTicker,
} from "coinbase-pro-node";
import * as CoinbaseGateway from "../gateways/coinbase-gateway";
import * as formatters from "../utils/formatters";
import TrendAnalysis from "../interfaces/trend-analysis";

function getBuyThreshold(
    averagePrice: number,
    sellThresholdPercentage: number,
): number {
    return formatters.roundDownToTwoDecimals(
        averagePrice - averagePrice * (sellThresholdPercentage / 100)
    );
}

function getSellThreshold(
    averagePrice: number,
    lastBuyPrice: number,
    buyThresholdPercentage: number,
    sellThresholdPercentage: number,
): number {
    const averageMargin = averagePrice * (sellThresholdPercentage / 100);
    const lastBuyMargin = lastBuyPrice * ((buyThresholdPercentage + sellThresholdPercentage) / 100);
    const averageMarginThreshold = formatters.roundDownToTwoDecimals(
        averagePrice + averageMargin
    );
    const lastBuyMarginThreshold = formatters.roundDownToTwoDecimals(
        lastBuyPrice + lastBuyMargin
    );
    if (lastBuyPrice > 0) {
        return Math.min(averageMarginThreshold, lastBuyMarginThreshold);
    }
    return averageMarginThreshold;
}

export async function getBuySellThresholds(
    averagePrice: number,
    lastBuyPrice: number,
    buyThresholdPercentage: number,
    sellThresholdPercentage: number
): Promise<{ buyThreshold: number; sellThreshold: number; }> {
    const buyThreshold = getBuyThreshold(
        averagePrice,
        buyThresholdPercentage,
    );
    const sellThreshold = getSellThreshold(
        averagePrice,
        lastBuyPrice,
        buyThresholdPercentage,
        sellThresholdPercentage,
    );
    return {
        buyThreshold,
        sellThreshold,
    };
}

export function getBuySize(
    fiatBalance: number,
    budget: number,
    productPrice: number
): number {
    const amount = fiatBalance > budget ? budget : fiatBalance;
    return formatters.roundDownToFourDecimals(amount / productPrice);
}

export async function getAccountBalance(currency: string): Promise<number> {
    var accounts = await CoinbaseGateway.getAccounts();
    if (accounts) {
        var account = accounts.find((a) => a.currency === currency);
        var balance = formatters.roundDownToFourDecimals(
            parseFloat(account.balance)
        );
        if (balance > 1) {
            return formatters.roundDownToTwoDecimals(balance);
        }
        return balance;
    }
    return 0;
}

export async function getFills(
    productId: string
): Promise<PaginatedData<Fill>> {
    return (await CoinbaseGateway.getFills(productId)) as PaginatedData<Fill>;
}

export async function get24HrAveragePrice(
    productId: string
): Promise<number> {
    const product24HrStats = (await CoinbaseGateway.getProduct24HrStats(
        productId
    )) as ProductStats;
    const high = parseFloat(product24HrStats.high);
    const low = parseFloat(product24HrStats.low);
    let average = high - (high - low) / 2;
    return average;
}

async function getOneTwentyDayCandles(
    productId: string,
): Promise<Candle[]> {
    const now = new Date();
    const oneTwentyDaysAgo = new Date(now);
    oneTwentyDaysAgo.setDate(oneTwentyDaysAgo.getDate() - 120);
    const lastThirtyDayCandles = (await CoinbaseGateway.getProductCandles(productId, 86400, oneTwentyDaysAgo, now)) as Candle[];
    return lastThirtyDayCandles;
}

export async function getTrendAnalysis(
    productId: string,
): Promise<TrendAnalysis> {
    const oneTwentyDayCandles = await getOneTwentyDayCandles(productId);
    let oneTwentyDayAverage = 0;
    let oneTwentyDayLowPrice = Number.MAX_SAFE_INTEGER;
    let oneTwentyDayHighPrice = 0;
    let oneTwentyDayRunningAverage = 0;
    let ninetyDayAverage = 0;
    let ninetyDayLowPrice = Number.MAX_SAFE_INTEGER;
    let ninetyDayHighPrice = 0;
    let ninetyDayRunningAverage = 0;
    let sixtyDayAverage = 0;
    let sixtyDayLowPrice = Number.MAX_SAFE_INTEGER;
    let sixtyDayHighPrice = 0;
    let sixtyDayRunningAverage = 0;
    let thirtyDayAverage = 0;
    let thirtyDayLowPrice = Number.MAX_SAFE_INTEGER;
    let thirtyDayHighPrice = 0;
    let thirtyDayRunningAverage = 0;
    let sevenDayAverage = 0;
    let sevenDayLowPrice = Number.MAX_SAFE_INTEGER;
    let sevenDayHighPrice = 0;
    let sevenDayRunningAverage = 0;
    for (const [index, value] of oneTwentyDayCandles.entries()) {
        const average = (value.close + value.open) / 2;
        if (index < (oneTwentyDayCandles.length - 90)) { //90-120
            if (value.low < oneTwentyDayLowPrice) oneTwentyDayLowPrice = value.low;
            if (value.high > oneTwentyDayHighPrice) oneTwentyDayHighPrice = value.high;
            oneTwentyDayRunningAverage += average;
            oneTwentyDayAverage = oneTwentyDayRunningAverage / (index + 1);
        }
        if (index < (oneTwentyDayCandles.length - 60) && index >= (oneTwentyDayCandles.length - 90)) { //60-90
            if (value.low < ninetyDayLowPrice) ninetyDayLowPrice = value.low;
            if (value.high > ninetyDayHighPrice) ninetyDayHighPrice = value.high;
            ninetyDayRunningAverage += average;
            ninetyDayAverage = ninetyDayRunningAverage / ((index + 1) - (oneTwentyDayCandles.length - 90));
        }
        if (index < (oneTwentyDayCandles.length - 30) && index >= (oneTwentyDayCandles.length - 60)) { //30-60
            if (value.low < sixtyDayLowPrice) sixtyDayLowPrice = value.low; 
            if (value.high > sixtyDayHighPrice) sixtyDayHighPrice = value.high;
            sixtyDayRunningAverage += average;
            sixtyDayAverage = sixtyDayRunningAverage / ((index + 1) - (oneTwentyDayCandles.length - 60));
        }
        if (index < (oneTwentyDayCandles.length - 7) && index >= (oneTwentyDayCandles.length - 30)) { //7-30
            if (value.low < thirtyDayLowPrice) thirtyDayLowPrice = value.low;
            if (value.high > thirtyDayHighPrice) thirtyDayHighPrice = value.high;
            thirtyDayRunningAverage += average;
            thirtyDayAverage = thirtyDayRunningAverage / ((index + 1) - (oneTwentyDayCandles.length - 30));
        }
        if (index >= (oneTwentyDayCandles.length - 7)) { //0-7
            if (value.low < sevenDayLowPrice) sevenDayLowPrice = value.low;
            if (value.high > sevenDayHighPrice) sevenDayHighPrice = value.high;
            sevenDayRunningAverage += average;
            sevenDayAverage = sevenDayRunningAverage / ((index + 1) - (oneTwentyDayCandles.length - 7));
        }
    }
    return {
        oneTwentyDayAverage,
        oneTwentyDayLowPrice,
        oneTwentyDayHighPrice,
        ninetyDayAverage,
        ninetyDayLowPrice,
        ninetyDayHighPrice,
        sixtyDayAverage,
        sixtyDayLowPrice,
        sixtyDayHighPrice,
        thirtyDayAverage,
        thirtyDayLowPrice,
        thirtyDayHighPrice,
        sevenDayAverage,
        sevenDayLowPrice,
        sevenDayHighPrice,
    };
}

export async function getProductPrice(
    productId: string,
): Promise<number> {
    const productTicker = (await CoinbaseGateway.getProductTicker(
        productId
    )) as ProductTicker;
    return parseFloat(productTicker.price);
}

async function marketSell(
    size: string,
    productId: string,
): Promise<void | Order> {
    return await CoinbaseGateway.marketSell(size, productId);
}

async function marketBuy(
    price: string,
    size: string,
    productId: string,
): Promise<void | Order> {
    return await CoinbaseGateway.marketBuy(price, size, productId);
}

export async function sellAtMarketValue(
    productId: string,
    size: string,
): Promise<number> {
    await marketSell(size, productId) as PendingOrder;
    return parseFloat(size);
}

export async function buyAtMarketValue(
    fiatBalance: number,
    budget: number,
    price: number,
    productId: string,
): Promise<number> {
    const size = getBuySize(fiatBalance, budget, price);
    await marketBuy(
        fiatBalance.toString(),
        size.toString(),
        productId
    ) as PendingOrder;
    return size;
}
