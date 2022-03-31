import { Fill, PaginatedData } from "coinbase-pro-node";
import TrendAnalysis from "../../interfaces/trend-analysis";

export default interface ReplayData {
    timestamp: Date;
    productId: string;
    action: string;
    price: number; 
    averagePrice: number; 
    cryptoBalance: number; 
    fiatBalance: number; 
    budget: number;
    fills: PaginatedData<Fill>;
    trendAnalysis: TrendAnalysis;
}
