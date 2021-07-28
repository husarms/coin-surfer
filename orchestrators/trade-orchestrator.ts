import {
    Fill, PaginatedData, ProductStats, ProductTicker
} from "coinbase-pro-node";
import * as CoinbaseGateway from "../gateways/coinbase-gateway";
import * as formatters from "../utils/formatters";

const getBuyThreshold = (averagePrice: number, thresholdPercentage: number) => {
    return formatters.roundDownToTwoDecimals(averagePrice - averagePrice * (thresholdPercentage / 100));
};

const getSellThreshold = (
    averagePrice: number,
    lastBuyPrice: number,
    thresholdPercentage: number,
    sellAtLoss: boolean = false,
) => {
    if (lastBuyPrice > averagePrice && !sellAtLoss) {
        const margin = lastBuyPrice * ((thresholdPercentage * 2) / 100);
        return formatters.roundDownToTwoDecimals(lastBuyPrice + margin);
    } else {
        const margin = averagePrice * (thresholdPercentage / 100);
        return formatters.roundDownToTwoDecimals(averagePrice + margin);
    }
};

export async function getBuySellThresholds (
    productId: string,
    buyThresholdPercentage: number,
    sellThresholdPercentage: number,
    sellAtLoss: boolean
) {
    const averagePrice = await get24HrAveragePrice(productId);
    const lastBuyPrice = await getLastBuyPrice(productId);
    const buyThreshold = getBuyThreshold(averagePrice, buyThresholdPercentage);
    const sellThreshold = getSellThreshold(
        averagePrice,
        lastBuyPrice,
        sellThresholdPercentage,
        sellAtLoss,
    );
    return {
        buyThreshold,
        sellThreshold,
    };
};

export function getBuySize (fiatBalance: number, budget: number, productPrice: number) {
    const amount = fiatBalance > budget ? budget : fiatBalance;
    return formatters.roundDownToFourDecimals(amount / productPrice);
};

export async function getAccountBalance (currency: string) {
    var accounts = await CoinbaseGateway.getAccounts();
    if (accounts) {
        var account = accounts.find((a) => a.currency === currency);
        var balance = formatters.roundDownToFourDecimals(parseFloat(account.balance));
        if(balance > 1){
            return formatters.roundDownToTwoDecimals(balance);
        }
        return balance;
    }
    return 0;
};

export async function getAccountBalances (fiatCurrency: string, cryptoCurrency: string) {
    const fiatBalance = await getAccountBalance(fiatCurrency);
    const cryptoBalance = await getAccountBalance(cryptoCurrency);
    return {
        fiatBalance,
        cryptoBalance,
    };
};

export async function getLastBuyPrice (productId: string) {
    const fills = await CoinbaseGateway.getFills(productId) as PaginatedData<Fill>;
    if (fills) {
        const fill = fills.data.find((f) => f.side === "buy" && f.settled === true);
        return Number(fill ? fill.price : 0);
    }
    return 0;
};

export async function get24HrAveragePrice (productId: string) {
    const product24HrStats = await CoinbaseGateway.getProduct24HrStats(productId) as ProductStats;
    const high = parseFloat(product24HrStats.high);
    const low = parseFloat(product24HrStats.low);
    let average = high - (high - low) / 2;
    return average;
};

export async function getProductPrice (productId: string) {
    const productTicker = await CoinbaseGateway.getProductTicker(productId) as ProductTicker;
    return parseFloat(productTicker.price);
};

export async function marketSell (size: string, productId: string) {
    return await CoinbaseGateway.marketSell(size, productId);
};

export async function marketBuy (price: string, size: string, productId: string) {
    return await CoinbaseGateway.marketBuy(price, size, productId);
};

export async function sellAllAtMarketValue (cryptoCurrency: string, productId: string) {
    const cryptoBalance = await getAccountBalance(cryptoCurrency);
    const size = cryptoBalance.toString();
    const sellResponse = await marketSell(size, productId);
    return sellResponse;
};

export async function buyAllAtMarketValue (
    fiatCurrency: string,
    budget: number,
    price: number,
    productId: string,
) {
    const fiatBalance = await getAccountBalance(fiatCurrency);
    const size = getBuySize(fiatBalance, budget, price);
    const buyResponse = await marketBuy(fiatBalance.toString(), size.toString(), productId);
    return buyResponse;
};
