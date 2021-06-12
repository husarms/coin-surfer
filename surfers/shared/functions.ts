import TradeOrchestrator = require("../../orchestrators/trade-orchestrator");
import NotificationOrchestrator = require("../../orchestrators/notification-orchestrator");
import { PendingOrder } from "coinbase-pro-node";
import { Actions } from "../../utils/enums";
import * as Formatters from "../../utils/formatters";

export async function getStatusMessage (
    fiatCurrency: string,
    cryptoCurrency: string,
    budget: number,
    price: number,
    averagePrice: number,
    buyThreshold: number,
    sellThreshold: number,
    action: Actions.Sell | Actions.Buy,
) : Promise<string> {
    const { fiatBalance, cryptoBalance } =
        await TradeOrchestrator.getAccountBalances(
            fiatCurrency,
            cryptoCurrency
        );
    const buyBudget = fiatBalance > budget ? budget : fiatBalance;
    const formattedDate = Formatters.getDateMMddyyyyHHmmss();

    const message = action === Actions.Sell
        ? `looking to sell ${cryptoBalance} ${cryptoCurrency} at $${sellThreshold}`
        : `looking to buy $${buyBudget} worth of ${cryptoCurrency} at $${buyThreshold}`;

    return `${formattedDate}, ${cryptoCurrency}, ${averagePrice.toFixed(4)}, ${price.toFixed(
            4
        )}, - ${message} - current price = $${price.toFixed(4)}`;
};

export async function getBalance(currency: string){
    return await TradeOrchestrator.getAccountBalance(currency);
}

export async function getBalancesAndVerify (fiatCurrency: string, cryptoCurrency: string) {
    const { fiatBalance, cryptoBalance } =
        await TradeOrchestrator.getAccountBalances(
            fiatCurrency,
            cryptoCurrency
        );
    console.log(
        `${fiatCurrency} balance = $${fiatBalance}, ${cryptoCurrency} balance = ${cryptoBalance}`
    );

    if (fiatBalance < 10 && cryptoBalance < 1) throw "Insufficient balances";

    return { fiatBalance, cryptoBalance };
};

export async function sendBuyNotification (
    size: string,
    cryptoCurrency: string,
    price: number,
    fiatCurrency: string,
) {
    NotificationOrchestrator.sendBuyNotification(
        size,
        cryptoCurrency,
        price,
        fiatCurrency
    );
};

export async function sendSellNotification (
    size: string,
    cryptoCurrency: string,
    price: number,
    fiatCurrency: string,
) {
    NotificationOrchestrator.sendSellNotification(
        size,
        cryptoCurrency,
        price,
        fiatCurrency
    );
};

export async function buy (fiatCurrency: string, budget: number, price: number, productId: string) {
    const { status, size } = await TradeOrchestrator.buyAllAtMarketValue(
        fiatCurrency,
        budget,
        price,
        productId
    ) as PendingOrder;
    console.log(`Buy complete. Status = ${status} Size = ${size}`);
    return size;
};

export async function sell (cryptoCurrency: string, productId: string) {
    const { status, size } = await TradeOrchestrator.sellAllAtMarketValue(
        cryptoCurrency,
        productId
    ) as PendingOrder;
    console.log(`Sell complete. Status = ${status} Size = ${size}`);
    return size;
};

export async function getPrices (productId: string) {
    const price = await TradeOrchestrator.getProductPrice(productId);
    const averagePrice = await TradeOrchestrator.get24HrAveragePrice(productId);
    return { price, averagePrice };
};

export async function getThresholds (
    productId: string,
    buyThresholdPercentage: number,
    sellThresholdPercentage: number,
) {
    return await TradeOrchestrator.getBuySellThresholds(
        productId,
        buyThresholdPercentage,
        sellThresholdPercentage
    );
};
