![logo](docs/images/logo.png)

"If you don't find a way to make money while you sleep, you will work until you die."

# Contents
- [Overview](#overview)
- [Surfers](#surfers)
    - [Simple Threshold Surfer](#simple-threshold-surfer)
    - [AI Threshold Surfer](#ai-threshold-surfer)   
- [Features](#features)
    - [Logging](#logging)
    - [Notifications](#notifications)
    - [Visualization](#visualization)
    - [Web Socket Feed](#web-socket-feed)
- [Setup](#setup)
- [How to Run](#how-to-run)
- [TODO](#todo)

# Overview

Coin Surfer is a tool for automated cryptocurrency trading. 

It uses "surfers" to continually monitor the market and attempt to determine the best time to make a trade.

A few [example surfers](#surfers) are provided - or you can write your own utilizing the functions provided in the project.

# Surfers

## Simple Threshold Surfer
The [simple threshold surfer](https://github.com/husarms/coin-surfer/blob/master/surfers/simple-threshold.ts) is the first example iteration and uses the difference between the current price and 24-hour average price.

Buy and sell thresholds are set manually as a percentage difference from the 24-hour average price.

The idea is to buy and sell when an unusal drop or increase in price occurs (e.g. 5% above or below the 24-hour average).

Please note that some products are more volatile than others - so choosing the right threshold percentages takes some experimentation.

## AI Threshold Surfer
The [AI threshold surfer](https://github.com/husarms/coin-surfer/blob/master/surfers/ai-threshold.ts) is the second example iteration and uses 7-day and 30-day high and low prices to determine it's own thresholds.

The historical high and low prices are taken from the [Coinbase Pro API product candles](https://docs.cloud.coinbase.com/exchange/reference/exchangerestapi_getproductcandles).

Rather than waiting for a sudden drop or rise in price - it waits for the price to hit historically low or high levels.

Compared to the simple threshold method - it sets / adjusts itself automatically and seems less risky with the potential for greater margins.

# Features

## Logging

The current state of each surfer is logged to the console at each polling interval.

![log](docs/images/log.png)

Logs for each product are kept in the "logs" folder if you wish to do historical analysis.

![historical-log](docs/images/historical-log.jpg)

## Notifications
Optional text or email notifications can be sent on buy / sell actions.

![notification](docs/images/text-notification.jpg)

## Visualization
The [web directory](https://github.com/husarms/coin-surfer/tree/master/web) contains a React app for visualizing Coin Surfer as it runs.

![visualization](docs/images/visualization-2.png)

## Web Socket Feed
When a web socket feed is enabled (see [Setup](#setup)) - the app emits it's current state on each update interval.

The included [Visualization App](https://github.com/husarms/coin-surfer/tree/master/web) is driven off this feed.

# Setup
1. Requires a [Coinbase Pro](https://pro.coinbase.com) account and access to the [Coinbase Pro Api](https://docs.pro.coinbase.com/)
2. Optionally - a [SendGrid](https://sendgrid.com) account to send buy / sell notifications
3. Configure your own "secrets.ts" file under the [config directory](https://github.com/husarms/coin-surfer/tree/master/config)
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
4. Set your own parameters for cryptocurrency, buy / sell thresholds and budget in [index.ts](https://github.com/husarms/coin-surfer/blob/master/index.ts).
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

# How to Run
Install depedencies
```bash
npm install
```
Run 
```bash
npm run start
```

# TODO
1. ~~**Implement some basic AI** - use historical data to automatically adjust and optimize thresholds based on market trends~~
2. Improve error handling (API errors)
3. Move secrets to environment variables
4. Add more unit tests
5. Visualization
    - Experiment with other chart packages
    - Add ability to hover over charts and get values
