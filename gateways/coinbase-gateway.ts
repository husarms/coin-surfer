import {
    Account,
    Candle,
    CoinbasePro,
    Fill,
    Order,
    OrderSide,
    OrderType,
    PaginatedData,
    ProductStats,
    ProductTicker,
    WebSocketChannelName,
    WebSocketEvent,
    WebSocketTickerMessage,
} from "coinbase-pro-node";
import Configuration from "../config";

const authorization = {
    apiKey: Configuration.Coinbase.key,
    apiSecret: Configuration.Coinbase.secret,
    passphrase: Configuration.Coinbase.passphrase,
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

export async function getProductTicker(product_id: string): Promise<ProductTicker | void> {
    return coinbaseClient.rest.product
        .getProductTicker(product_id)
        .then((data: ProductTicker) => {
            return data;
        })
        .catch((error) => {
            console.error(error);
        });
}

export async function getProduct24HrStats(product: string): Promise<ProductStats | void> {
    return coinbaseClient.rest.product
        .getProductStats(product)
        .then((data: ProductStats) => {
            return data;
        })
        .catch((error) => {
            console.error(error);
        });
}

export async function getProductCandles(
    product: string, granularity: 60 | 300 | 900 | 3600 | 21600 | 86400 = 86400, start: Date, end: Date)
    : Promise<Candle[] | void> {
    return coinbaseClient.rest.product
        .getCandles(product, { granularity, start: start.toUTCString(), end: end.toUTCString() })
        .then((data: Candle[]) => {
            return data;
        })
        .catch((error) => {
            console.error(error);
        });
}

export async function getAccounts(): Promise<Account[] | void> {
    return coinbaseClient.rest.account
        .listAccounts()
        .then((data: Account[]) => {
            return data;
        })
        .catch((error) => {
            console.error(error);
        });
}

export async function getFills(productId: string): Promise<PaginatedData<Fill> | void> {
    return coinbaseClient.rest.fill
        .getFillsByProductId(productId)
        .then((data: PaginatedData<Fill>) => {
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
): Promise<Order | void> {
    return coinbaseClient.rest.order
        .placeOrder({
            side: OrderSide.BUY,
            type: OrderType.MARKET,
            funds,
            size,
            product_id,
        })
        .then((data: Order) => {
            return data;
        })
        .catch((error) => {
            console.error(error);
        });
}

export async function marketSell(size: string, product_id: string): Promise<Order | void> {
    return coinbaseClient.rest.order
        .placeOrder({
            side: OrderSide.SELL,
            type: OrderType.MARKET,
            size,
            product_id,
        })
        .then((data: Order) => {
            return data;
        })
        .catch((error) => {
            console.error(error);
        });
}
