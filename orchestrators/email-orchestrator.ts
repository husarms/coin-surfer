import * as SendGridMail from "@sendgrid/mail";
import Secrets from "../config/secrets";

SendGridMail.setApiKey(Secrets.SendGridConfiguration.apiKey);

function sendEmail (subject: string, body: string) {
    const email = {
        from: Secrets.Email.fromAddress,
        to: Secrets.Email.toAddress,
        subject,
        text: body,
        // html: '<b>Hello world</b>'
    };

    SendGridMail
        .send(email)
        .then(() => {
            console.log("Email sent");
        })
        .catch((error) => {
            console.error(error);
        });
};

export function sendBuyNotification (
    size: string,
    cryptoCurrency: string,
    price: number,
    fiatCurrency: string,
) {
    const value = parseFloat(size) * price;
    sendEmail(
        "Coin Surfer - Buy Notification",
        `Bought ${size} ${cryptoCurrency} at $${price}, ${fiatCurrency} value = $${value}`
    );
};

export function sendSellNotification (
    size: string,
    cryptoCurrency: string,
    price: number,
    fiatCurrency: string,
) {
    const value = parseFloat(size) * price;
    sendEmail(
        "Coin Surfer - Sell Notification",
        `Sold ${size} ${cryptoCurrency} at $${price}, ${fiatCurrency} value = $${value}`
    );
};
