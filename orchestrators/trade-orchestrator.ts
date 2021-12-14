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

const getBuyThreshold = (
    averagePrice: number,
    thresholdPercentage: number
) => {
    return formatters.roundDownToTwoDecimals(
        averagePrice - averagePrice * (thresholdPercentage / 100)
    );
};

const getSellThreshold = (
    price: number,
    averagePrice: number,
    lastBuyPrice: number,
    thresholdPercentage: number
) => {
    const averageMargin = averagePrice * (thresholdPercentage / 100);
    const lastBuyMargin = lastBuyPrice * ((thresholdPercentage * 2) / 100);
    const stopLossMargin = lastBuyPrice * ((thresholdPercentage * 3) / 100);
    const averageMarginThreshold = formatters.roundDownToTwoDecimals(
        averagePrice + averageMargin
    );
    const lastBuyMarginThreshold = formatters.roundDownToTwoDecimals(
        lastBuyPrice + lastBuyMargin
    );
    const stopLossThreshold = formatters.roundDownToTwoDecimals(
        lastBuyPrice - stopLossMargin
    );
    if (lastBuyPrice > 0) {
        if (price <= stopLossThreshold) return 0;
        return Math.min(averageMarginThreshold, lastBuyMarginThreshold);
    }
    return averageMarginThreshold;
};

export async function getBuySellThresholds(
    price: number,
    averagePrice: number,
    lastBuyPrice: number,
    buyThresholdPercentage: number,
    sellThresholdPercentage: number
) {
    const buyThreshold = getBuyThreshold(
        averagePrice,
        buyThresholdPercentage
    );
    const sellThreshold = getSellThreshold(
        price,
        averagePrice,
        lastBuyPrice,
        sellThresholdPercentage
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
) {
    const amount = fiatBalance > budget ? budget : fiatBalance;
    return formatters.roundDownToFourDecimals(amount / productPrice);
}

export async function getAccountBalance(currency: string) {
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
) {
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

export async function get24HrAveragePrice(productId: string) {
    const product24HrStats = (await CoinbaseGateway.getProduct24HrStats(
        productId
    )) as ProductStats;
    const high = parseFloat(product24HrStats.high);
    const low = parseFloat(product24HrStats.low);
    let average = high - (high - low) / 2;
    return average;
}

export async function getTrendAnalysis(productId: string): Promise<TrendAnalysis> {
    const end = new Date();
    end.setDate(end.getDate() - 1)
    end.setUTCHours(0, 0, 0, 0);
    const start = new Date();
    start.setDate(start.getDate() - 31);
    start.setUTCHours(0, 0, 0, 0);
    const thirtyDayCandles = (await CoinbaseGateway.getProductCandles(productId, start, end)) as Candle[];
    let thirtyDayAverage = 0;
    let thirtyDayLowThreshold = 0;
    let thirtyDayHighThreshold = 0;
    let sevenDayAverage = 0;
    let sevenDayLowThreshold = 0;
    let sevenDayHighThreshold = 0;
    let thirtyDayRunningAverage = 0;
    let sevenDayRunningAverage = 0;
    for (const [index, value] of thirtyDayCandles.entries()) {
        const average = (value.close + value.open) / 2;
        const lowThreshold = Math.abs((average - value.low) / average) * 100;
        const highThreshold = Math.abs((average - value.high) / average) * 100;
        if (index >= (thirtyDayCandles.length - 7)) {
            if (lowThreshold > sevenDayLowThreshold) sevenDayLowThreshold = lowThreshold;
            if (highThreshold > sevenDayHighThreshold) sevenDayHighThreshold = highThreshold;
            sevenDayRunningAverage += average;
            sevenDayAverage = sevenDayRunningAverage / ((index + 1) - (thirtyDayCandles.length - 7));
        }
        thirtyDayRunningAverage += average;
        if (lowThreshold > thirtyDayLowThreshold) thirtyDayLowThreshold = lowThreshold;
        if (highThreshold > thirtyDayHighThreshold) thirtyDayHighThreshold = highThreshold;
        thirtyDayAverage = thirtyDayRunningAverage / (index + 1);
    }
    return { thirtyDayAverage, thirtyDayLowThreshold, thirtyDayHighThreshold, sevenDayAverage, sevenDayLowThreshold, sevenDayHighThreshold };
}

export async function getProductPrice(productId: string) {
    const productTicker = (await CoinbaseGateway.getProductTicker(
        productId
    )) as ProductTicker;
    return parseFloat(productTicker.price);
}

export async function marketSell(size: string, productId: string) {
    return await CoinbaseGateway.marketSell(size, productId);
}

export async function marketBuy(
    price: string,
    size: string,
    productId: string
) {
    return await CoinbaseGateway.marketBuy(price, size, productId);
}

export async function sellAtMarketValue(
    productId: string,
    size: string
) {
    const sellResponse = await marketSell(size, productId);
    return sellResponse;
}

export async function buyAtMarketValue(
    fiatBalance: number,
    budget: number,
    price: number,
    productId: string
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
