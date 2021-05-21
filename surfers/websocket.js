const coinbaseGateway = require("../gateways/coinbase-gateway");
const formatters = require("../utils/formatters");

function callback(data) {
    if(data.type === "ticker"){
        const { product_id, price, low_24h, high_24h, time } = data;
        const formattedTimestamp = formatters.formatDate(time);
        console.log(`${product_id} at ${formattedTimestamp} = $${price} (low = $${low_24h}, high = $${high_24h})`);
    }
}

exports.surf = async function(parameters) {
    console.log(`Let's go surfing...`);
    const { fiatCurrency, cryptoCurrency, buyThresholdPercentage, sellThresholdPercentage, budget } = parameters;
    const productId = `${cryptoCurrency}-${fiatCurrency}`;
    coinbaseGateway.listenToTickerFeed(productId, callback);
};
