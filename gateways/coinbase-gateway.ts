import {
    Account,
    Candle,
    CandleGranularity,
    Coinbase,
    CreateOrderResponse,
    Fill,
    OrderSide,
    PaginatedData,
    Product,
    ProductStats,
    WebSocketChannelName,
    WebSocketEvent,
    WebSocketTickerMessage,
} from "coinbase-advanced-node";
import * as crypto from "crypto";
import Configuration from "../config";
import { json } from "stream/consumers";

const authorization = {
    apiKey: Configuration.CoinbaseAdvanced.key,
    apiSecret: Configuration.CoinbaseAdvanced.secret,
};

const coinbaseClient = new Coinbase(authorization);

export function listenToTickerFeed(
    product_id: string,
    callback: (tickerMessage: WebSocketTickerMessage) => void
) {
    const channel = {
        channel: WebSocketChannelName.TICKER,
        product_ids: [product_id],
    };

    // Wait for open WebSocket to send messages
    coinbaseClient.ws.on(WebSocketEvent.ON_OPEN, async () => {
        // Subscribe to WebSocket channel
        await coinbaseClient.ws.subscribe([channel]);
    });

    // Listen to WebSocket channel updates
    coinbaseClient.ws.on(WebSocketEvent.ON_MESSAGE_TICKER, async (tickerMessage) => {
        callback(tickerMessage);
    });

    // Connect to WebSocket
    coinbaseClient.ws.connect({ debug: false });
}

export async function getProduct(product_id: string): Promise<Product | void> {
    return coinbaseClient.rest.product
        .getProduct(product_id)
        .then((data: Product) => {
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
    product: string, 
    granularity: CandleGranularity = CandleGranularity.ONE_DAY, 
    start: Date, 
    end: Date
): Promise<Candle[] | void> {
    return coinbaseClient.rest.product
        .getCandles(product, { granularity: granularity, start: start.toUTCString(), end: end.toUTCString() })
        .then((data: Candle[]) => {
            return data;
        })
        .catch((error) => {
            console.error(error);
        });
}

export async function getAccounts(): Promise<PaginatedData<Account> | void> {
    return coinbaseClient.rest.account
        .listAccounts()
        .then((data: PaginatedData<Account>) => {
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
    size: string,
    product_id: string
): Promise<CreateOrderResponse | void> {
    return coinbaseClient.rest.order
        .placeOrder({
            client_order_id: crypto.randomUUID(),
            product_id,
            side: OrderSide.BUY,
            order_configuration: {
                market_market_ioc: {
                    quote_size: size
                }
            }
        })
        .then((data: CreateOrderResponse) => {
            return data;
        })
        .catch((error) => {
            console.error(error);
        });
}

export async function marketSell(
    size: string, 
    product_id: string
): Promise<CreateOrderResponse | void> {
    return coinbaseClient.rest.order
        .placeOrder({
            client_order_id: crypto.randomUUID(),
            product_id,
            side: OrderSide.SELL,
            order_configuration: {
                market_market_ioc: {
                    base_size: size
                }
            }
        })
        .then((data: CreateOrderResponse) => {
            return data;
        })
        .catch((error) => {
            console.error(error);
        });
}
