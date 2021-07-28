import * as SendGridGateway from "../gateways/sendgrid-gateway";

export function sendBuyNotification (
    size: string,
    cryptoCurrency: string,
    price: number,
    fiatCurrency: string,
) {
    const value = parseFloat(size) * price;
    SendGridGateway.sendEmail(
        "Coin Surfer - Buy Notification",
        `Bought ${size} ${cryptoCurrency} at $${price}, ${fiatCurrency} value = $${value.toFixed(2)}`
    );
};

export function sendSellNotification (
    size: string,
    cryptoCurrency: string,
    price: number,
    fiatCurrency: string,
) {
    const value = parseFloat(size) * price;
    SendGridGateway.sendEmail(
        "Coin Surfer - Sell Notification",
        `Sold ${size} ${cryptoCurrency} at $${price}, ${fiatCurrency} value = $${value.toFixed(2)}`
    );
};
