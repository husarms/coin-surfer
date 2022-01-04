import React from "react";
import TrendAnalysis from "../../../interfaces/trend-analysis";
import MultilineChart from "../components/chart/MultilineChart";
import ChartData from "../interfaces/chart-data";
import Button from "../components/button/Button";
import "./ProductPage.scss";

const priceColor = "#5E4FA2";
const averageColor = "#A0D3FF";
const thresholdColor = "#A8DF53";
const sevenDayTrendColor = "#C7BA00";
const thirtyDayTrendColor = "#C98C3C";
const sixtyDayTrendColor = "#C97632";
const ninetyDayTrendColor = "#A14E43";

export interface ProductPageProps {
    product: string;
    timestamp: Date;
    price: string;
    priceData: ChartData[];
    average: string;
    averageData: ChartData[];
    sevenDayAverage: string;
    sevenDayAverageData: ChartData[];
    thirtyDayAverage: string;
    thirtyDayAverageData: ChartData[];
    threshold: string;
    thresholdData: ChartData[];
    sevenDayTrend: string;
    thirtyDayTrend: string;
    sixtyDayTrend: string;
    ninetyDayTrend: string;
    trendPrediction: string;
    trendAnalysis: TrendAnalysis;
    message: string;
}

function ProductPage({
    price,
    priceData,
    average,
    averageData,
    sevenDayAverageData,
    thirtyDayAverageData,
    threshold,
    thresholdData,
    sevenDayTrend,
    thirtyDayTrend,
    sixtyDayTrend,
    ninetyDayTrend,
    trendPrediction,
    trendAnalysis,
    message,
}: ProductPageProps): JSX.Element {
    const [showTrend, setShowTrend] = React.useState(false);
    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 7);
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(now.getDate() - 30);
    const sixtyDaysAgo = new Date(now);
    sixtyDaysAgo.setDate(now.getDate() - 60);
    const ninetyDaysAgo = new Date(now);
    ninetyDaysAgo.setDate(now.getDate() - 90);
    const trendAverageData: ChartData[] = [
        { value: parseFloat(average), date: now },
        { value: trendAnalysis.sevenDayAverage, date: sevenDaysAgo },
        { value: trendAnalysis.thirtyDayAverage, date: thirtyDaysAgo },
        { value: trendAnalysis.sixtyDayAverage, date: sixtyDaysAgo },
        { value: trendAnalysis.ninetyDayAverage, date: ninetyDaysAgo },
    ];
    const trendLowData: ChartData[] = [
        { value: trendAnalysis.sevenDayLowPrice, date: now },
        { value: trendAnalysis.sevenDayLowPrice, date: sevenDaysAgo },
        { value: trendAnalysis.thirtyDayLowPrice, date: thirtyDaysAgo },
        { value: trendAnalysis.sixtyDayLowPrice, date: sixtyDaysAgo },
        { value: trendAnalysis.ninetyDayLowPrice, date: ninetyDaysAgo },
    ];
    const trendHighData: ChartData[] = [
        { value: trendAnalysis.sevenDayHighPrice, date: now },
        { value: trendAnalysis.sevenDayHighPrice, date: sevenDaysAgo },
        { value: trendAnalysis.thirtyDayHighPrice, date: thirtyDaysAgo },
        { value: trendAnalysis.sixtyDayHighPrice, date: sixtyDaysAgo },
        { value: trendAnalysis.ninetyDayHighPrice, date: ninetyDaysAgo },
    ];
    const lastTimestamp = message.split(',')[0];
    const lastMessage = message.split(',')[5];
    return (
        <div className="grid-container m-t-2xl">
            <div className="table-container p-t-xl p-l-s p-r-s">
                <table className="table table-striped text-mono fine-print" style={{ textAlign: 'left' }}>
                    <tr style={{ color: priceColor, filter: 'brightness(1.5)' }}>
                        <td>Price</td>
                        <td>${price}</td>
                    </tr>
                    <tr style={{ color: averageColor }}>
                        <td>Average</td>
                        <td>${average}</td>
                    </tr>
                    <tr style={{ color: thresholdColor }}>
                        <td>Threshold</td>
                        <td>{threshold}</td>
                    </tr>
                    <tr style={{ color: thresholdColor }}>
                        <td>Trend</td>
                        <td>{trendPrediction}</td>
                    </tr>
                    <tr style={{ color: sevenDayTrendColor }}>
                        <td>7-Day</td>
                        <td>{sevenDayTrend}</td>
                    </tr>
                    <tr style={{ color: thirtyDayTrendColor }}>
                        <td>30-Day</td>
                        <td>{thirtyDayTrend}</td>
                    </tr>
                    <tr style={{ color: sixtyDayTrendColor }}>
                        <td>30-60-Day</td>
                        <td>{sixtyDayTrend}</td>
                    </tr>
                    <tr style={{ color: ninetyDayTrendColor }}>
                        <td>60-90-Day</td>
                        <td>{ninetyDayTrend}</td>
                    </tr>
                </table>
                <p className="text-mono fine-print m-b-l p-s">{message}</p>
                <Button onClick={() => setShowTrend(!showTrend)}>{showTrend ? 'Real Time Data' : 'Trend Analysis'}</Button>
            </div>
            <div className="chart-container">
                <MultilineChart
                    data={showTrend ? [
                        {
                            name: "Average",
                            color: averageColor,
                            items: trendAverageData ? trendAverageData : [],
                            strokeWidth: 2,
                        },
                        {
                            name: "Low",
                            color: priceColor,
                            items: trendLowData ? trendLowData : [],
                            strokeWidth: 2,
                            strokeDashArray: '2,5',
                        },
                        {
                            name: "High",
                            color: thresholdColor,
                            items: trendHighData ? trendHighData : [],
                            strokeWidth: 2,
                            strokeDashArray: '2,5',
                        },
                    ] : [
                        {
                            name: "Average",
                            color: averageColor,
                            items: averageData ? averageData : [],
                            strokeWidth: 2,
                        },
                        {
                            name: "Price",
                            color: priceColor,
                            items: priceData ? priceData : [],
                            strokeWidth: 3,
                        },
                        {
                            name: "Threshold",
                            color: thresholdColor,
                            items: thresholdData ? thresholdData : [],
                            strokeWidth: 2,
                        },
                        {
                            name: "SevenDayAverage",
                            color: sevenDayTrendColor,
                            items: sevenDayAverageData ? sevenDayAverageData : [],
                            strokeWidth: 1,
                            strokeDashArray: '2,5',
                        },
                        {
                            name: "ThirtyDayAverage",
                            color: thirtyDayTrendColor,
                            items: thirtyDayAverageData ? thirtyDayAverageData : [],
                            strokeWidth: 1,
                            strokeDashArray: '2,5',
                        },
                    ]}
                    dimensions={{
                        width: window.innerWidth * .75,
                        height: window.innerHeight * .75,
                        margin: {
                            top: 20,
                            right: 30,
                            bottom: 20,
                            left: 50,
                        },
                    }}
                />
            </div>
        </div>
    );
}

export default ProductPage;
