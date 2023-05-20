export default interface SurfParameters {
    fiatCurrency: string;
    cryptoCurrency: string;
    buyThresholdPercentage: number;
    sellThresholdPercentage: number;
    budget: number;
    tradesEnabled: boolean;
    notificationsEnabled: boolean;
    webSocketFeedEnabled: boolean;
    isLocal: boolean;
}
