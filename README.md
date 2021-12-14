![logo](docs/images/logo.png)

Node.js app for automated cryptocurrency trading

## Contents
- [How it works](#how-it-works)
- [Setup](#setup)
- [How to run](#how-to-run)
- [Visualization](#visualization)
- [Web socket feed](#web-socket-feed)
- [TODO](#todo)

## How it works

The current "simple threshold" surfer works as follows -

1. Check your account balances and decide whether to buy or sell
    - If you have a balance of crypto - look to sell
    - Otherwise check your fiat balance and look to buy
2. Calculate buy / sell thresholds based on threshold percentages
3. Poll the Coinbase API for the current ticker price and 24-hour average price
4. Buy or sell when the threshold is hit (e.g. buy when current price is 4% below average price, sell when 4% above)

![log](docs/images/log.png)

Optional text / email notifications can be sent on buy / sell

![notification](docs/images/text-notification.jpg)

Logs for each currency are kept if you wish to do historical analysis and optimize your thresholds (or create your own algorithm)

![historical-log](docs/images/historical-log.jpg)

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
4. Set your own parameters for cryptocurrency, buy / sell thresholds and budget in index.ts
```JavaScript
(async () => {
    await SimpleThresholdSurfer.surf({
        fiatCurrency: Products.USDollar,
        cryptoCurrency: Products.Etherium,
        buyThresholdPercentage: 4,
        sellThresholdPercentage: 4,
        budget: 1000,
        notificationsEnabled: true,
        webSocketFeedEnabled: true,
    });
    await SimpleThresholdSurfer.surf({
        fiatCurrency: Products.USDollar,
        cryptoCurrency: Products.Bitcoin,
        buyThresholdPercentage: 4,
        sellThresholdPercentage: 4,
        budget: 1000,
        notificationsEnabled: true,
        webSocketFeedEnabled: false,
    });
})();
```
This example surfs both Bitcoin and Etherium

## How to run
Install depedencies
```bash
npm install
```
Run 
```bash
npm run start
```

## Visualization
The [web directory](https://github.com/husarms/coin-surfer/tree/master/web) contains a React app for visualizing Coin Surfer as it runs

Check out this folder for more details

![visualization](docs/images/visualization-2.png)

## Web socket feed
When a web socket feed is enabled - the app emits it's current state on each update interval

The included [Visualization App](https://github.com/husarms/coin-surfer/tree/master/web) is driven off this feed

An example web socket message:
``` JSON
{
    "parameters": {
        "fiatCurrency": "USD",
        "cryptoCurrency": "BTC",
        "buyThresholdPercentage": 5,
        "sellThresholdPercentage": 5,
        "budget": 0,
        "notificationsEnabled": true,
        "webSocketFeedEnabled": true
    },
    "productId": "BTC-USD",
    "cryptoBalance": 0.7024,
    "fiatBalance": 0.0004,
    "lastBuyPrice": 45078.26,
    "lastBuyDate": "2021-12-04T05:26:55.559Z",
    "lastSellDate": "2021-11-19T02:42:39.992Z",
    "action": "SELL",
    "price": 46782.52,
    "averagePrice": 47550,
    "trendAnalysis": {
        "thirtyDayAverage": 55663.285322580654,
        "thirtyDayLowThreshold": 17.699433501947137,
        "thirtyDayHighThreshold": 5.866209581085457,
        "sevenDayAverage": 49145.645000000004,
        "sevenDayLowThreshold": 5.537933058197211,
        "sevenDayHighThreshold": 5.866209581085457
    },
    "buyThreshold": 44934.75,
    "buyThresholdPercentage": 5.5,
    "sellThreshold": 50355.45,
    "sellThresholdPercentage": 5.9,
    "statusMessage": "12/13/2021 9:26:38 PM, BTC, 47550.00, 46782.52, 50355.45, looking to sell 0.7024 BTC at $50355.45 (+5.9%) (last buy price $45078.26); current price = $46782.52 (-1.61%)",
    "timestamp": "2021-12-14T02:26:38.932Z"
}
```

## TODO
1. ~~**Implement some basic AI** - use historical data to automatically adjust and optimize thresholds based on market trends~~
2. Improve error handling (API errors)
3. Add more unit tests
4. Get better at handling crashes
    - Stop loss, buy in low, adjust sell margins higher
5. Visualization
    - Experiment with other chart packages
    - Add ability to hover over charts and get values
