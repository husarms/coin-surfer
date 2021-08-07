# coin-surfer
Node.js app for automated cryptocurrency trading.

![log](docs/images/log.png)

Text notifications on trades

![notification](docs/images/text-notification.jpg)

## Setup
1. Requires a [Coinbase Pro](https://pro.coinbase.com) account and access to the [Coinbase Pro Api](https://docs.pro.coinbase.com/)
2. Optionally - a [SendGrid](https://sendgrid.com) account to send buy / sell notifications
3. Configure your own "secrets.ts" file under the "config" directory
```JavaScript
export default {
    CoinbaseConfiguration: {
        key: "<Add your key here>",
        secret: "<Add your secret here>",
        passphrase: "<Add your passphrase here>",
    },
    SendGridConfiguration : {
        apiKey: "<Add your api key here>",
    },
    Email: {
        toAddress: "<Add your to address here>",
        fromAddress: "<Add your from address here>",
    },
};
```
5. Set your own parameters for cryptocurrency, buy / sell thresholds and budget in index.ts
```JavaScript
(async () => {
    await SimpleThresholdSurfer.surf({
        fiatCurrency: Products.USDollar,
        cryptoCurrency: Products.Etherium,
        buyThresholdPercentage: 4,
        sellThresholdPercentage: 4,
        budget: 1000,
        notificationsEnabled: true,
    });
    await SimpleThresholdSurfer.surf({
        fiatCurrency: Products.USDollar,
        cryptoCurrency: Products.Bitcoin,
        buyThresholdPercentage: 4,
        sellThresholdPercentage: 4,
        budget: 1000,
        notificationsEnabled: true,
    });
})();
```
## How to run
Install depedencies
```bash
npm install
```
Run 
```bash
npm run start
```
