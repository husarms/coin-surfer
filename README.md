# coin-surfer
Node.js app for automated cryptocurrency trading

## Setup
1. Requires a [Coinbase Pro](https://pro.coinbase.com) account and access to the [Coinbase Pro Api](https://docs.pro.coinbase.com/)
2. Optionally - can use a [SendGrid](https://sendgrid.com) account to send buy / sell notifications
3. Create a secrets.ts file under the "config" folder with your own key, secret and passphrase
4. Set your own parameters for cryptocurrency, buy / sell thresholds and budget in index.ts
```JavaScript
const surfParameters = {
    fiatCurrency: USDollar,
    cryptoCurrency: Cardano,
    buyThresholdPercentage: 4,
    sellThresholdPercentage: 4.5,
    budget: 1000,
};
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
Run with log file
```bash
npm run start-and-log
```
