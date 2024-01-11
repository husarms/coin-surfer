import * as LogOrchestrator from "../../orchestrators/log-orchestrator";
import * as NotificationOrchestrator from "../../orchestrators/notification-orchestrator";
import * as TradeOrchestrator from "../../orchestrators/trade-orchestrator";
import Fill from "../../interfaces/fill";
import { Actions } from "../../utils/enums";
import { Logger } from "../../utils/logger";
import * as Formatters from "../../utils/formatters";
import Prices from "../../interfaces/prices";
import SurfState from "../../interfaces/surf-state";
import TrendAnalysis from "../../interfaces/trend-analysis";
import { OrderSide } from "coinbase-advanced-node";

export function uploadLogs(logger: Logger) {
    LogOrchestrator.uploadLogFiles(logger);
}

export function getCurrentPercentage(
    price: number,
    averagePrice: number
): number {
    let currentPercentage = Math.abs(
        Formatters.roundDownToTwoDecimals(
            ((price - averagePrice) / price) * 100
        )
    );
    if (price < averagePrice) currentPercentage *= -1;
    return currentPercentage;
}

export function getStatusMessage(state: SurfState): string {
    const {
        parameters,
        action,
        price,
        averagePrice,
        buyThreshold,
        buyThresholdPercentage,
        sellThreshold,
        sellThresholdPercentage,
        cryptoBalance,
        fiatBalance,
        lastBuyPrice,
    } = state;
    const {
        budget,
        cryptoCurrency,
    } = parameters;
    const buyBudget = (fiatBalance > budget ? budget : fiatBalance).toFixed(2);
    const formattedDate = Formatters.getDateMMddyyyyHHmmss();
    const currentPercentage = getCurrentPercentage(price, averagePrice);
    const threshold = action === Actions.Sell ? sellThreshold : buyThreshold;
    const profit = (cryptoBalance * sellThreshold) - (cryptoBalance * lastBuyPrice);
    const profitWithFees = (profit * .975).toFixed(2);
    const message =
        action === Actions.Sell
            ? `looking to sell ${cryptoBalance} ${cryptoCurrency} at $${threshold} (+${sellThresholdPercentage}%) (bought at $${lastBuyPrice}, profit $${profitWithFees})`
            : `looking to buy $${buyBudget} worth of ${cryptoCurrency} at $${threshold} (-${buyThresholdPercentage}%)`;
    const formattedPrice = price.toFixed(2);
    const plusMinus = currentPercentage > 0 ? "+" : "";
    return `${formattedDate}, ${cryptoCurrency}, ${message}; current price = $${formattedPrice} (${plusMinus}${currentPercentage}%)`;
}

export function getDataMessage(state: SurfState): string {
    const {
        parameters, action, price,
        averagePrice, cryptoBalance, fiatBalance,
        lastBuyPrice, trendAnalysis,
    } = state;
    const { budget, cryptoCurrency } = parameters;
    const {
        sevenDayAverage, sevenDayHighPrice, sevenDayLowPrice,
        thirtyDayAverage, thirtyDayHighPrice, thirtyDayLowPrice,
        sixtyDayAverage, sixtyDayHighPrice, sixtyDayLowPrice,
        ninetyDayAverage, ninetyDayHighPrice, ninetyDayLowPrice,
        oneTwentyDayAverage, oneTwentyDayHighPrice, oneTwentyDayLowPrice
    } = trendAnalysis;
    let prices = [
        price, averagePrice, cryptoBalance, fiatBalance, lastBuyPrice, budget,
        sevenDayAverage, sevenDayHighPrice, sevenDayLowPrice,
        thirtyDayAverage, thirtyDayHighPrice, thirtyDayLowPrice,
        sixtyDayAverage, sixtyDayHighPrice, sixtyDayLowPrice,
        ninetyDayAverage, ninetyDayHighPrice, ninetyDayLowPrice,
        oneTwentyDayAverage, oneTwentyDayHighPrice, oneTwentyDayLowPrice
    ];
    const formattedPrices = formatPrices(prices);
    const formattedDate = Formatters.getDateMMddyyyyHHmmss();
    return `${formattedDate}, ${cryptoCurrency}, ${action}, ${formattedPrices}`;
}

function formatPrices(prices: number[]): string {
    const formattedPrices = prices.map(price => Number(price).toFixed(2));
    return formattedPrices.join(", ");
}

export async function getBalances(fiatCurrency: string, cryptoCurrency: string): Promise<{ fiatBalance: number, cryptoBalance: number }> {
    const { fiatBalance, cryptoBalance } = await TradeOrchestrator.getAccountBalances(fiatCurrency, cryptoCurrency);
    return { fiatBalance, cryptoBalance };
}

export async function sendBuyNotification(state: SurfState, size: string) {
    const { parameters, price } = state;
    const { cryptoCurrency, fiatCurrency } = parameters;
    NotificationOrchestrator.sendBuyNotification(
        size,
        cryptoCurrency,
        price,
        fiatCurrency
    );
}

export async function sendSellNotification(state: SurfState, size: string) {
    const { parameters, price } = state;
    const { cryptoCurrency, fiatCurrency } = parameters;
    NotificationOrchestrator.sendSellNotification(
        size,
        cryptoCurrency,
        price,
        fiatCurrency
    );
}

export async function buy(state: SurfState): Promise<any> {
    const { parameters, fiatBalance, productId } = state;
    const { budget } = parameters;
    if (fiatBalance < 1) {
        console.log(`Skipping buy. Balance ${fiatBalance} < 1`);
        return { isComplete: false, size: 0 };
    }
    const orderSize = await TradeOrchestrator.buyAtMarketValue(
        fiatBalance,
        budget,
        productId
    );
    console.log(`Buy complete. Size = ${orderSize}`);
    return { isComplete: true, size: orderSize.toString() };
}

export async function sell(state: SurfState): Promise<any> {
    const { productId, cryptoBalance } = state;
    const size = cryptoBalance;
    if (size < 0.01) {
        console.log(`Skipping sell. Size ${size} < 0.01`);
        return { isComplete: false, size: size.toString() };
    }
    const orderSize = await TradeOrchestrator.sellAtMarketValue(
        productId,
        size.toString()
    )
    console.log(`Sell complete. Size = ${orderSize}`);
    return { isComplete: true, size: size.toString() };
}

export async function getPrices(productId: string): Promise<Prices> {
    const price = await TradeOrchestrator.getProductPrice(productId);
    const averagePrice = await TradeOrchestrator.get24HrAveragePrice(productId);
    return { price, averagePrice };
}

export async function getTrendAnalysis(productId: string): Promise<TrendAnalysis> {
    const trendAnalysis = await TradeOrchestrator.getTrendAnalysis(productId);
    return trendAnalysis;
}

export async function getLastFills(productId: string): Promise<{ lastBuyFill: Fill, lastSellFill: Fill }> {
    const fills = await TradeOrchestrator.getFills(productId);
    const buyFill = fills.data.find((f) => f.side === OrderSide.BUY);
    const sellFill = fills.data.find((f) => f.side === OrderSide.SELL);
    const lastBuyFill: Fill = {
        action: Actions.Buy,
        date: buyFill ? new Date(buyFill.trade_time) : undefined,
        price: buyFill ? parseFloat(buyFill.price) : undefined,
    };
    const lastSellFill: Fill = {
        action: Actions.Sell,
        date: sellFill ? new Date(sellFill.trade_time) : undefined,
        price: sellFill ? parseFloat(sellFill.price) : undefined,
    };
    return { lastBuyFill, lastSellFill };
}

export async function getThresholds(
    averagePrice: number,
    lastBuyPrice: number,
    buyThresholdPercentage: number,
    sellThresholdPercentage: number
) {
    return await TradeOrchestrator.getBuySellThresholds(
        averagePrice,
        lastBuyPrice,
        buyThresholdPercentage,
        sellThresholdPercentage
    );
}
