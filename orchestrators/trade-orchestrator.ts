import {
    Candle,
    Fill,
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

export async function getAccountBalances(
    fiatCurrency: string,
    cryptoCurrency: string
): Promise<{ fiatBalance: number; cryptoBalance: number; }> {
    const fiatBalance = await getAccountBalance(fiatCurrency);
    const cryptoBalance = await getAccountBalance(cryptoCurrency);
    return {
        fiatBalance,
        cryptoBalance,
    };
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

async function getThirtyDayCandles(
    productId: string,
): Promise<Candle[]> {
    const now = new Date();
    const tenDaysAgo = new Date(now);
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
    const twentyDaysAgo = new Date(tenDaysAgo);
    twentyDaysAgo.setDate(twentyDaysAgo.getDate() - 10);
    const thirtyDaysAgo = new Date(twentyDaysAgo);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 10);

    const lastTenDayCandles = (await CoinbaseGateway.getProductCandles(productId, 3600, tenDaysAgo, now)) as Candle[];
    const lastTwentyDayCandles = (await CoinbaseGateway.getProductCandles(productId, 3600, twentyDaysAgo, tenDaysAgo)) as Candle[];
    const lastThirtyDayCandles = (await CoinbaseGateway.getProductCandles(productId, 3600, thirtyDaysAgo, twentyDaysAgo)) as Candle[];
    return [...lastThirtyDayCandles, ...lastTwentyDayCandles, ...lastTenDayCandles];
}

export async function getTrendAnalysis(
    productId: string,
): Promise<TrendAnalysis> {
    const thirtyDayCandles = await getThirtyDayCandles(productId);
    let thirtyDayAverage = 0;
    let thirtyDayLowThreshold = 0;
    let thirtyDayLowPrice = Number.MAX_SAFE_INTEGER;
    let thirtyDayLowDate = new Date();
    let thirtyDayHighThreshold = 0;
    let thirtyDayHighPrice = 0;
    let thirtyDayHighDate = new Date();
    let sevenDayAverage = 0;
    let sevenDayLowThreshold = 0;
    let sevenDayLowPrice = Number.MAX_SAFE_INTEGER;
    let sevenDayLowDate = new Date();
    let sevenDayHighThreshold = 0;
    let sevenDayHighPrice = 0;
    let sevenDayHighDate = new Date();
    let thirtyDayRunningAverage = 0;
    let sevenDayRunningAverage = 0;
    for (const [index, value] of thirtyDayCandles.entries()) {
        const average = (value.close + value.open) / 2;
        const lowThreshold = Math.abs((average - value.low) / average) * 100;
        const highThreshold = Math.abs((average - value.high) / average) * 100;
        if (index >= (thirtyDayCandles.length - (7 * 24))) {
            if (lowThreshold > sevenDayLowThreshold) sevenDayLowThreshold = lowThreshold;
            if (value.low < sevenDayLowPrice) {
                sevenDayLowPrice = value.low;
                sevenDayLowDate = new Date(value.openTimeInISO);
            }
            if (highThreshold > sevenDayHighThreshold) sevenDayHighThreshold = highThreshold;
            if (value.high > sevenDayHighPrice) {
                sevenDayHighPrice = value.high;
                sevenDayHighDate = new Date(value.openTimeInISO);
            }
            sevenDayRunningAverage += average;
            sevenDayAverage = sevenDayRunningAverage / ((index + 1) - (thirtyDayCandles.length - (7 * 24)));
        }
        thirtyDayRunningAverage += average;
        if (lowThreshold > thirtyDayLowThreshold) thirtyDayLowThreshold = lowThreshold;
        if (value.low < thirtyDayLowPrice) {
            thirtyDayLowPrice = value.low;
            thirtyDayLowDate = new Date(value.openTimeInISO);
        }
        if (highThreshold > thirtyDayHighThreshold) thirtyDayHighThreshold = highThreshold;
        if (value.high > thirtyDayHighPrice) {
            thirtyDayHighPrice = value.high;
            thirtyDayHighDate = new Date(value.openTimeInISO);
        }
        thirtyDayAverage = thirtyDayRunningAverage / (index + 1);
    }
    return {
        thirtyDayAverage,
        thirtyDayLowThreshold,
        thirtyDayLowPrice,
        thirtyDayLowDate,
        thirtyDayHighThreshold,
        thirtyDayHighPrice,
        thirtyDayHighDate,
        sevenDayAverage,
        sevenDayLowThreshold,
        sevenDayLowPrice,
        sevenDayLowDate,
        sevenDayHighThreshold,
        sevenDayHighPrice,
        sevenDayHighDate,
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

export async function marketSell(
    size: string,
    productId: string,
) {
    return await CoinbaseGateway.marketSell(size, productId);
}

export async function marketBuy(
    price: string,
    size: string,
    productId: string,
) {
    return await CoinbaseGateway.marketBuy(price, size, productId);
}

export async function sellAtMarketValue(
    productId: string,
    size: string,
) {
    const sellResponse = await marketSell(size, productId);
    return sellResponse;
}

export async function buyAtMarketValue(
    fiatBalance: number,
    budget: number,
    price: number,
    productId: string,
) {
    const size = getBuySize(fiatBalance, budget, price);
    const buyResponse = await marketBuy(
        fiatBalance.toString(),
        size.toString(),
        productId
    ) as PendingOrder;
    const { status } = buyResponse;
    return { status, size };
}
