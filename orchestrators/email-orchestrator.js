const sendGridMail = require("@sendgrid/mail");
const Secrets = require("../config/secrets");

sendGridMail.setApiKey(Secrets.SendGridConfiguration.apiKey);

const sendEmail = (subject, body) => {
    const email = {
        from: Secrets.Email.fromAddress,
        to: Secrets.Email.toAddress,
        subject,
        text: body,
        // html: '<b>Hello world</b>'
    };

    sendGridMail
        .send(email)
        .then(() => {
            console.log("Email sent");
        })
        .catch((error) => {
            console.error(error);
        });
};

const sendBuyNotification = (
    size,
    cryptoCurrency,
    price,
    fiatCurrency
) => {
    sendEmail(
        "Coin Surfer - Buy Notification",
        `Bought ${size} ${cryptoCurrency} at $${price}, ${fiatCurrency} value = $${
            size * price
        }`
    );
};

const sendSellNotification = (
    size,
    cryptoCurrency,
    price,
    fiatCurrency
) => {
    sendEmail(
        "Coin Surfer - Sell Notification",
        `Sold ${size} ${cryptoCurrency} at $${price}, ${fiatCurrency} value = $${
            size * price
        }`
    );
};

module.exports = {
    sendBuyNotification,
    sendSellNotification,
};
