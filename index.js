const CoinbaseGateway = require("./gateways/coinbase-gateway");

const Bitcoin = "BTC";
const BitcoinCash = "BCH";
const Etherium = "ETH";
const USDollar = "USD";

const getAccountBalance = async (currency) => {
    var accounts = await CoinbaseGateway.getAccounts();
    var account = accounts.find((a) => a.currency === currency);
    return roundDownToTwoDecimals(parseFloat(account.balance));
};

const getLastBuyPrice = async (productId) => {
    const fills = await CoinbaseGateway.getFills(productId);
    const fill = fills.find(f => f.side === 'buy' && f.settled === true);
    return fill ? fill.price : 0;
}

const get24HrAveragePrice = async (cryptoCurrency) => {
    var product24HrStats = await CoinbaseGateway.getProduct24HrStats(
        cryptoCurrency
    );
    const high = parseFloat(product24HrStats.high);
    const low = parseFloat(product24HrStats.low);
    let average = high - (high - low) / 2;
    return average;
};

const getBuyThreshold = (averagePrice, thresholdPercentage) => {
    return (averagePrice - averagePrice * (thresholdPercentage / 100)).toFixed(
        2
    );
};

const getSellThreshold = (averagePrice, lastBuyPrice, thresholdPercentage) => {
    const priceBasis = Math.max(averagePrice, lastBuyPrice);
    return (priceBasis + priceBasis * (thresholdPercentage / 100)).toFixed(
        2
    );
};

const getBuySize = (fiatBalance, productPrice) => {
    return Math.floor((fiatBalance / productPrice) * 10000) / 10000;
};

const roundDownToTwoDecimals = (number) => {
    return Math.floor(number * 100) / 100;
};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
};

(async () => {
    const fiatCurrency = USDollar;
    const cryptoCurrency = BitcoinCash;
    const productId = `${cryptoCurrency}-${fiatCurrency}`;
    const buyThresholdPercentage = 5;
    const sellThresholdPercentage = 5;
    const fiatBalance = await getAccountBalance(fiatCurrency);
    const cryptoBalance = await getAccountBalance(cryptoCurrency);

    let lookingToSell = fiatBalance < 10;
    console.log(`Current fiat balance = $${fiatBalance} (${fiatCurrency})`);
    console.log(
        `Looking to ${
            lookingToSell ? "sell" : "buy"
        } ${cryptoCurrency} (current balance = ${cryptoBalance})...`
    );

    const averagePriceInLast24Hrs = await get24HrAveragePrice(productId);
    console.log(
        `Average price for '${productId}' in last 24 hours = $${averagePriceInLast24Hrs}...`
    );

    const lastBuyPrice = await getLastBuyPrice(productId);
    console.log(
        `Last buy price for '${productId}'  = $${lastBuyPrice}...`
    );

    const interval = setInterval(async function () {
        const averagePrice = await get24HrAveragePrice(productId);
        const lastBuyPrice = await getLastBuyPrice(productId);
        const buyThreshold = getBuyThreshold(
            averagePrice,
            buyThresholdPercentage
        );
        const sellThreshold = getSellThreshold(
            averagePrice,
            lastBuyPrice,
            sellThresholdPercentage
        );
        const ticker = await CoinbaseGateway.getProductTicker(productId);
        const price = parseFloat(ticker.price);
        console.log(
            `Current ${productId} price at ${formatDate(
                ticker.time
            )} = $${price} (buy @${buyThreshold}, sell @${sellThreshold})`
        );

        if (lookingToSell) {
            if (price >= sellThreshold) {
                console.log(
                    `Sell threshold hit (${price} >= ${sellThreshold})`
                );
                const cryptoBalance = await getAccountBalance(cryptoCurrency);
                const size = cryptoBalance;
                console.log(
                    `Selling ${size} ${cryptoCurrency} at $${price}, ${fiatCurrency} value = $${
                        size * price
                    }`
                );
                const sellResponse = CoinbaseGateway.marketSell(
                    cryptoBalance,
                    productId
                );
                console.log(
                    `Sell complete. Response = ${JSON.stringify(sellResponse)}`
                );
                lookingToSell = false;
            }
        } else {
            if (price <= buyThreshold) {
                console.log(`Buy threshold hit (${price} <= ${buyThreshold})`);
                const fiatBalance = await getAccountBalance(fiatCurrency);
                const size = getBuySize(fiatBalance, price);
                console.log(
                    `Buying ${size} ${cryptoCurrency} at $${price}, ${fiatCurrency} value = $${
                        size * price
                    }`
                );
                const buyResponse = await CoinbaseGateway.marketBuy(
                    fiatBalance,
                    size,
                    productId
                );
                console.log(`Buy complete. Order Id = ${buyResponse.id}`);
                lookingToSell = true;
            }
        }
    }, 10000);
})();
