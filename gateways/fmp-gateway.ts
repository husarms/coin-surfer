import axios from "axios";
import Secrets from "../config/secrets";

const apiKey = Secrets.FMP.apiKey;
const baseUrl = "https://financialmodelingprep.com";

// https://financialmodelingprep.com/developer/docs/#Historical-Cryptocurrencies-Price
export async function getHistoricalData(
    product: string,
    granularity: "1min" | "5min" | "15min" | "30min" | "1hour" | "4hour"
) {
    return await axios.get(
        `${baseUrl}/api/v3/historical-chart/${granularity}/${product}?apikey=${apiKey}`
    );
}

export async function getFullHistoricalData(product: string) {
    return await axios.get(
        `${baseUrl}/api/v3/historical-chart/${product}?apikey=${apiKey}`
    );
}
