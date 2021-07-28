import *  as CoinbaseGateway from "../gateways/coinbase-gateway";
import * as Formatters from "../utils/formatters";

function callback(data) {
    if(data.type === "ticker"){
        const { product_id, price, low_24h, high_24h, time } = data;
        const formattedTimestamp = Formatters.formatDateyyyyMMddHHmmss(time);
        console.log(`${product_id} at ${formattedTimestamp} = $${price} (low = $${low_24h}, high = $${high_24h})`);
    }
}

export async function surf(parameters) {
    console.log(`Let's go surfing...`);
    const { fiatCurrency, cryptoCurrency, buyThresholdPercentage, sellThresholdPercentage, budget } = parameters;
    const productId = `${cryptoCurrency}-${fiatCurrency}`;
    CoinbaseGateway.listenToTickerFeed(productId, callback);
};
