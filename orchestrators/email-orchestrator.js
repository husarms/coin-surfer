const nodemailer = require("nodemailer");
const Secrets = require("../config/secrets");

// async..await is not allowed in global scope, must use a wrapper
const sendEmail = async function (subject, body) {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        auth: {
            user: Secrets.EtherealConfiguration.user,
            pass: Secrets.EtherealConfiguration.pass,
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: Secrets.Email.fromAddress,  // sender address
        to: Secrets.Email.toAddress, // list of receivers
        subject: subject, // Subject line
        text: body, // plain text body
        //html: "<b>Hello world?</b>", // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
};

const sendBuyNotification = async function (size, cryptoCurrency, price, fiatCurrency) {
    await sendEmail("Coin Surfer - Buy Notification", `Bought ${size} ${cryptoCurrency} at $${price}, ${fiatCurrency} value = $${
        size * price
    }`);
};

const sendSellNotification = async function (size, cryptoCurrency, price, fiatCurrency) {
    await sendEmail("Coin Surfer - Sell Notification", `Sold ${size} ${cryptoCurrency} at $${price}, ${fiatCurrency} value = $${
        size * price
    }`);
};

module.exports = {
    sendBuyNotification,
    sendSellNotification,
};
