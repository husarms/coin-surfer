import * as TradeOrchestrator from "../../orchestrators/trade-orchestrator";
import * as NotificationOrchestrator from "../../orchestrators/notification-orchestrator";
import { PendingOrder } from "coinbase-pro-node";
import Fill from "../../interfaces/fill";
import { Actions } from "../../utils/enums";
import * as Formatters from "../../utils/formatters";
import Prices from "../../interfaces/prices";
import Balances from "../../interfaces/balances";
import SurfState from "../../interfaces/surf-state";

export function getCurrentPercentage(
    price: number,
    averagePrice: number
): number {
    let currentPercentage = Math.abs(
        Formatters.roundDownToTwoDecimals(
            ((averagePrice - price) / averagePrice) * 100
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
        sellThreshold,
        cryptoBalance,
        fiatBalance,
        lastBuyPrice,
    } = state;
    const {
        budget,
        cryptoCurrency,
        buyThresholdPercentage,
        sellThresholdPercentage,
    } = parameters;
    const buyBudget = fiatBalance > budget ? budget : fiatBalance;
    const formattedDate = Formatters.getDateMMddyyyyHHmmss();
    const currentPercentage = getCurrentPercentage(price, averagePrice);
    const threshold = action === Actions.Sell ? sellThreshold : buyThreshold;
    const message =
        action === Actions.Sell
            ? `looking to sell ${cryptoBalance} ${cryptoCurrency} at $${sellThreshold} (+${sellThresholdPercentage}%) (last buy price $${lastBuyPrice})`
            : `looking to buy $${buyBudget} worth of ${cryptoCurrency} at $${buyThreshold} (-${buyThresholdPercentage}%)`;
    const formattedPrice = price.toFixed(4);
    const formattedAveragePrice = averagePrice.toFixed(4);
    const plusMinus = currentPercentage > 0 ? "+" : "";
    return `${formattedDate}, ${cryptoCurrency}, ${formattedAveragePrice}, ${formattedPrice}, ${threshold}, ${message}; current price = $${formattedPrice} (${plusMinus}${currentPercentage}%)`;
}

export async function getBalance(currency: string): Promise<number> {
    return await TradeOrchestrator.getAccountBalance(currency);
}

export async function getBalances(
    fiatCurrency: string,
    cryptoCurrency: string
): Promise<Balances> {
    const { fiatBalance, cryptoBalance } =
        await TradeOrchestrator.getAccountBalances(
            fiatCurrency,
            cryptoCurrency
        );
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
    const { parameters, fiatBalance, price, productId, lastSellDate } = state;
    const { budget } = parameters;
    const now = new Date();
    const hoursSinceLastSell =
        Math.abs(now.valueOf() - lastSellDate.valueOf()) / 36e5;
    if (hoursSinceLastSell < 4) {
        console.log(
            `Skipping buy. Hours since last sell ${hoursSinceLastSell} < 4`
        );
        return { isComplete: false, size: 0 };
    }
    if (fiatBalance < 0.01) {
        console.log(`Skipping buy. Balance ${fiatBalance} < 0.01`);
        return { isComplete: false, size: 0 };
    }
    const { status, size } = await TradeOrchestrator.buyAtMarketValue(
        fiatBalance,
        budget,
        price,
        productId
    );
    console.log(`Buy complete. Status = ${status} Size = ${size}`);
    return { isComplete: true, size: size.toString() };
}

export async function sell(state: SurfState): Promise<any> {
    const { productId, cryptoBalance } = state;
    const size = cryptoBalance;
    if (size < 0.01) {
        console.log(`Skipping sell. Size ${size} < 0.01`);
        return { isComplete: false, size: size.toString() };
    }
    const { status } = (await TradeOrchestrator.sellAtMarketValue(
        productId,
        size.toString()
    )) as PendingOrder;
    console.log(`Sell complete. Status = ${status} Size = ${size}`);
    return { isComplete: true, size: size.toString() };
}

export async function getPrices(productId: string): Promise<Prices> {
    const price = await TradeOrchestrator.getProductPrice(productId);
    const averagePrice = await TradeOrchestrator.get24HrAveragePrice(productId);
    return { price, averagePrice };
}

export async function getLastFills(productId: string) {
    const fills = await TradeOrchestrator.getFills(productId);
    const buyFill = fills.data.find((f) => f.side === "buy");
    const sellFill = fills.data.find((f) => f.side === "sell");
    const lastBuyFill: Fill = {
        action: Actions.Buy,
        date: buyFill ? new Date(buyFill.created_at) : undefined,
        price: buyFill ? parseFloat(buyFill.price) : undefined,
    };
    const lastSellFill: Fill = {
        action: Actions.Sell,
        date: sellFill ? new Date(sellFill.created_at) : undefined,
        price: sellFill ? parseFloat(sellFill.price) : undefined,
    };
    return { lastBuyFill, lastSellFill };
}

export async function getThresholds(
    price: number,
    averagePrice: number,
    lastBuyPrice: number,
    buyThresholdPercentage: number,
    sellThresholdPercentage: number
) {
    return await TradeOrchestrator.getBuySellThresholds(
        price,
        averagePrice,
        lastBuyPrice,
        buyThresholdPercentage,
        sellThresholdPercentage
    );
}
