import {
    CoinbasePro,
    OrderSide,
    OrderType,
    WebSocketChannelName,
    WebSocketEvent,
    WebSocketTickerMessage,
} from "coinbase-pro-node";
import Secrets from "../config/secrets";

const authorization = {
    apiKey: Secrets.CoinbaseProductionConfiguration.key,
    apiSecret: Secrets.CoinbaseProductionConfiguration.secret,
    passphrase: Secrets.CoinbaseProductionConfiguration.passphrase,
    // The Sandbox is for testing only and offers a subset of the products/assets:
    // https://docs.pro.coinbase.com/#sandbox
    useSandbox: false,
};

const coinbaseClient = new CoinbasePro(authorization);

export function listenToTickerFeed(
    product_id: string,
    callback: (tickerMessage: WebSocketTickerMessage) => void
) {
    const channel = {
        name: WebSocketChannelName.TICKER,
        product_ids: [product_id],
    };

    // Wait for open WebSocket to send messages
    coinbaseClient.ws.on(WebSocketEvent.ON_OPEN, () => {
        // Subscribe to WebSocket channel
        coinbaseClient.ws.subscribe([channel]);
    });

    // Listen to WebSocket channel updates
    coinbaseClient.ws.on(WebSocketEvent.ON_MESSAGE_TICKER, (tickerMessage) => {
        callback(tickerMessage);
    });

    // Connect to WebSocket
    coinbaseClient.ws.connect({ debug: false });
}

export async function getProductTicker(product_id: string) {
    return coinbaseClient.rest.product
        .getProductTicker(product_id)
        .then((data) => {
            return data;
        })
        .catch((error) => {
            console.error(error);
        });
}

export async function getProduct24HrStats(product: string) {
    return coinbaseClient.rest.product
        .getProductStats(product)
        .then((data) => {
            return data;
        })
        .catch((error) => {
            console.error(error);
        });
}

export async function getAccount(account_id: string) {
    return coinbaseClient.rest.account
        .getAccount(account_id)
        .then((data) => {
            return data;
        })
        .catch((error) => {
            console.error(error);
        });
}

export async function getAccounts() {
    return coinbaseClient.rest.account
        .listAccounts()
        .then((data) => {
            return data;
        })
        .catch((error) => {
            console.error(error);
        });
}

export async function getCoinbaseAccounts() {
    return coinbaseClient.rest.account
        .listCoinbaseAccounts()
        .then((data) => {
            return data;
        })
        .catch((error) => {
            console.error(error);
        });
}

export async function getFills(productId: string) {
    return coinbaseClient.rest.fill
        .getFillsByProductId(productId)
        .then((data) => {
            return data;
        })
        .catch((error) => {
            console.error(error);
        });
}

export async function limitBuy(
    price: string,
    size: string,
    product_id: string
) {
    return coinbaseClient.rest.order
        .placeOrder({
            side: OrderSide.BUY,
            type: OrderType.LIMIT,
            price,
            size,
            product_id,
        })
        .then((data) => {
            return data;
        })
        .catch((error) => {
            console.error(error);
        });
}

export async function marketBuy(
    funds: string,
    size: string,
    product_id: string
) {
    return coinbaseClient.rest.order
        .placeOrder({
            side: OrderSide.BUY,
            type: OrderType.MARKET,
            funds,
            size,
            product_id,
        })
        .then((data) => {
            return data;
        })
        .catch((error) => {
            console.error(error);
        });
}

export async function limitSell(
    price: string,
    size: string,
    product_id: string
) {
    return coinbaseClient.rest.order
        .placeOrder({
            side: OrderSide.SELL,
            type: OrderType.LIMIT,
            price,
            size,
            product_id,
        })
        .then((data) => {
            return data;
        })
        .catch((error) => {
            console.error(error);
        });
}

export async function marketSell(size: string, product_id: string) {
    return coinbaseClient.rest.order
        .placeOrder({
            side: OrderSide.SELL,
            type: OrderType.MARKET,
            size,
            product_id,
        })
        .then((data) => {
            return data;
        })
        .catch((error) => {
            console.error(error);
        });
}
