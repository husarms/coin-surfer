export default interface TrendAnalysis {
    thirtyDayAverage: number;
    thirtyDayLowThreshold: number;
    thirtyDayLowPrice: number;
    thirtyDayLowDate: Date;
    thirtyDayHighThreshold: number;
    thirtyDayHighPrice: number;
    thirtyDayHighDate: Date;
    sevenDayAverage: number;
    sevenDayLowThreshold: number;
    sevenDayLowPrice: number;
    sevenDayLowDate: Date;
    sevenDayHighThreshold: number;
    sevenDayHighPrice: number;
    sevenDayHighDate: Date;
}
