import {
    Fill,
    PaginatedData,
    PendingOrder,
    ProductStats,
    ProductTicker,
} from "coinbase-pro-node";
import * as CoinbaseGateway from "../gateways/coinbase-gateway";
import * as formatters from "../utils/formatters";

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
    lastBuyDate: Date,
    thresholdPercentage: number
) => {
    const now = new Date();
    const hoursSinceLastBuy = Math.abs(now.valueOf() - lastBuyDate.valueOf()) / 36e5;
    const averageMargin = averagePrice * (thresholdPercentage / 100);
    const lastBuyMargin = lastBuyPrice * ((thresholdPercentage * 2) / 100);
    const stopLossMargin = lastBuyPrice * ((thresholdPercentage * 1.5) / 100);
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
        // if (price <= stopLossThreshold) return 0;
        // return hoursSinceLastBuy < 72 
        // ? Math.max(averageMarginThreshold, lastBuyMarginThreshold)
        // : Math.min(averageMarginThreshold, lastBuyMarginThreshold);
        return Math.min(averageMarginThreshold, lastBuyMarginThreshold);
    }
    return averageMarginThreshold;
};

export async function getBuySellThresholds(
    price: number,
    averagePrice: number,
    lastBuyPrice: number,
    lastBuyDate: Date,
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
        lastBuyDate,
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
