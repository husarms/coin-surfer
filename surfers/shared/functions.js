const tradeOrchestrator = require("../../orchestrators/trade-orchestrator");
const emailOrchestrator = require("../../orchestrators/email-orchestrator");
const formatters = require("../../utils/formatters");

const logStatusMessage = async (
    price,
    averagePrice,
    buyThreshold,
    sellThreshold
) => {
    const { fiatBalance, cryptoBalance } =
        await tradeOrchestrator.getAccountBalances(
            fiatCurrency,
            cryptoCurrency
        );
    const buyBudget = fiatBalance > budget ? budget : fiatBalance;
    const formattedDate = formatters.formatDate(new Date());

    const message = lookingToSell
        ? `looking to sell ${cryptoBalance} ${cryptoCurrency} at $${sellThreshold}`
        : `looking to buy $${buyBudget} worth of ${cryptoCurrency} at $${buyThreshold}`;

    console.log(
        `${formattedDate}, ${averagePrice.toFixed(4)}, ${price.toFixed(
            4
        )}, - ${message} - current price = $${price.toFixed(4)}`
    );
};

const getBalancesAndVerify = async (fiatCurrency, cryptoCurrency) => {
    const { fiatBalance, cryptoBalance } =
        await tradeOrchestrator.getAccountBalances(
            fiatCurrency,
            cryptoCurrency
        );
    console.log(
        `${fiatCurrency} balance = $${fiatBalance}, ${cryptoCurrency} balance = ${cryptoBalance}`
    );

    if (fiatBalance < 10 || cryptoBalance < 1) throw "Insufficient balances";

    return { fiatBalance, cryptoBalance };
};

const sendBuyNotification = async (
    size,
    cryptoCurrency,
    price,
    fiatCurrency
) => {
    emailOrchestrator.sendBuyNotification(
        size,
        cryptoCurrency,
        price,
        fiatCurrency
    );
};

const sendSellNotification = async (
    size,
    cryptoCurrency,
    price,
    fiatCurrency
) => {
    emailOrchestrator.sendSellNotification(
        size,
        cryptoCurrency,
        price,
        fiatCurrency
    );
};

const buy = async (fiatCurrency, budget, price, productId) => {
    const { status, size } = await tradeOrchestrator.buyAllAtMarketValue(
        fiatCurrency,
        budget,
        price,
        productId
    );
    console.log(`Buy complete. Status = ${status} Size = ${size}`);
    return size;
};

const sell = async (cryptoCurrency, productId) => {
    const { status, size } = await tradeOrchestrator.sellAllAtMarketValue(
        cryptoCurrency,
        productId
    );
    console.log(`Sell complete. Status = ${status} Size = ${size}`);
    return size;
};

const getPrices = async (productId) => {
    const price = await tradeOrchestrator.getProductPrice(productId);
    const averagePrice = await tradeOrchestrator.get24HrAveragePrice(productId);
    return { price, averagePrice };
};

const getThresholds = async (
    productId,
    buyThresholdPercentage,
    sellThresholdPercentage
) => {
    return await tradeOrchestrator.getBuySellThresholds(
        productId,
        buyThresholdPercentage,
        sellThresholdPercentage
    );
};

module.exports = {
    logStatusMessage,
    getBalancesAndVerify,
    sendBuyNotification,
    sendSellNotification,
    buy,
    sell,
    getPrices,
    getThresholds
};
