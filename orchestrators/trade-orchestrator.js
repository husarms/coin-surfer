const coinbaseGateway = require("../gateways/coinbase-gateway");
const formatters = require("../utils/formatters");
const constants = require("../utils/constants");

const getBuyThreshold = (averagePrice, thresholdPercentage) => {
    return (averagePrice - averagePrice * (thresholdPercentage / 100)).toFixed(
        2
    );
};

const getSellThreshold = (averagePrice, lastBuyPrice, thresholdPercentage) => {
    if (lastBuyPrice > averagePrice) {
        const margin = lastBuyPrice * ((thresholdPercentage * 2) / 100);
        return (lastBuyPrice + margin).toFixed(2);
    } else {
        const margin = averagePrice * (thresholdPercentage / 100);
        return (averagePrice + margin).toFixed(2);
    }
};

const getBuySize = (fiatBalance, productPrice) => {
    return Math.floor((fiatBalance / productPrice) * 10000) / 10000;
};

const getAccountBalance = async (currency) => {
    var accounts = await coinbaseGateway.getAccounts();
    var account = accounts.find((a) => a.currency === currency);
    return formatters.roundDownToTwoDecimals(parseFloat(account.balance));
};

const getAccountBalances = async function (fiatCurrency, cryptoCurrency) {
    const fiatBalance = await getAccountBalance(fiatCurrency);
    const cryptoBalance = await getAccountBalance(cryptoCurrency);
    return {
        fiatBalance,
        cryptoBalance,
    };
};

const getBuyOrSell = async function () {
    const fiatBalance = await getAccountBalance(fiatCurrency);
    return fiatBalance < 10 ? constants.sell : constants.buy;
};

const getLastBuyPrice = async function (productId) {
    const fills = await coinbaseGateway.getFills(productId);
    const fill = fills.find((f) => f.side === "buy" && f.settled === true);
    return Number(fill ? fill.price : 0);
};

const get24HrAveragePrice = async function (productId) {
    var product24HrStats = await coinbaseGateway.getProduct24HrStats(productId);
    const high = parseFloat(product24HrStats.high);
    const low = parseFloat(product24HrStats.low);
    let average = high - (high - low) / 2;
    return average;
};

const getProductPrice = async function (productId) {
    const productTicker = await coinbaseGateway.getProductTicker(productId);
    return parseFloat(productTicker.price);
};

const marketSell = async function (size, productId) {
    return await coinbaseGateway.marketSell(size, productId);
};

const marketBuy = async function (price, size, productId) {
    return await coinbaseGateway.marketBuy(price, size, productId);
};

const sellAllAtMarketValue = async function (cryptoCurrency, productId) {
    const cryptoBalance = await getAccountBalance(cryptoCurrency);
    const size = cryptoBalance;
    console.log(
        `Selling ${size} ${cryptoCurrency} at $${price}, ${fiatCurrency} value = $${
            size * price
        }`
    );
    const sellResponse = await marketSell(
        cryptoBalance,
        productId
    );
    console.log(`Sell complete. Response = ${JSON.stringify(sellResponse)}`);
};

const buyAllAtMarketValue = async function (fiatCurrency, price, productId) {
    const fiatBalance = await getAccountBalance(fiatCurrency);
    const size = getBuySize(fiatBalance, price);
    console.log(
        `Buying ${size} ${cryptoCurrency} at $${price}, ${fiatCurrency} value = $${
            size * price
        }`
    );
    const buyResponse = await marketBuy(fiatBalance, size, productId);
    console.log(`Buy complete. Order Id = ${buyResponse.id}`);
};

const getBuySellThresholds = async function (
    productId,
    buyThresholdPercentage,
    sellThresholdPercentage
) {
    const averagePrice = await get24HrAveragePrice(productId);
    const lastBuyPrice = await getLastBuyPrice(productId);
    const buyThreshold = getBuyThreshold(averagePrice, buyThresholdPercentage);
    const sellThreshold = getSellThreshold(
        averagePrice,
        lastBuyPrice,
        sellThresholdPercentage
    );
    return {
        buyThreshold,
        sellThreshold,
    };
};

module.exports = {
    getAccountBalances,
    get24HrAveragePrice,
    getLastBuyPrice,
    getProductPrice,
    getBuySellThresholds,
    buyAllAtMarketValue,
    sellAllAtMarketValue,
};
