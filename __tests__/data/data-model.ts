export default interface DataModel {
    timestamp: Date;
    productId: string;
    action: string;
    price: number; 
    averagePrice: number; 
    cryptoBalance: number; 
    fiatBalance: number; 
    lastBuyPrice: number; 
    budget: number;
    sevenDayAverage: number; 
    sevenDayHighPrice: number; 
    sevenDayLowPrice: number;
    thirtyDayAverage: number; 
    thirtyDayHighPrice: number; 
    thirtyDayLowPrice: number;
    sixtyDayAverage: number; 
    sixtyDayHighPrice: number; 
    sixtyDayLowPrice: number;
    ninetyDayAverage: number; 
    ninetyDayHighPrice: number; 
    ninetyDayLowPrice: number;
    oneTwentyDayAverage: number; 
    oneTwentyDayHighPrice: number; 
    oneTwentyDayLowPrice: number;
}
