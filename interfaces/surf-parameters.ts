export default interface SurfParameters {
    fiatCurrency: string;
    cryptoCurrency: string;
    buyThresholdPercentage: number;
    sellThresholdPercentage: number;
    budget: number;
    notificationsEnabled: boolean;
    webSocketFeedEnabled: boolean;
    isLocal: boolean;
}
