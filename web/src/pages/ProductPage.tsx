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
    if (showTrend) {
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
            {value: parseFloat(average), date: now}, 
            {value: trendAnalysis.sevenDayAverage, date: sevenDaysAgo}, 
            {value: trendAnalysis.thirtyDayAverage, date: thirtyDaysAgo},
            {value: trendAnalysis.sixtyDayAverage, date: sixtyDaysAgo},
            {value: trendAnalysis.ninetyDayAverage, date: ninetyDaysAgo}
        ];
        const trendLowData: ChartData[] = [
            {value: trendAnalysis.sevenDayLowPrice, date: now}, 
            {value: trendAnalysis.sevenDayLowPrice, date: sevenDaysAgo}, 
            {value: trendAnalysis.thirtyDayLowPrice, date: thirtyDaysAgo},
            {value: trendAnalysis.sixtyDayLowPrice, date: sixtyDaysAgo},
            {value: trendAnalysis.ninetyDayLowPrice, date: ninetyDaysAgo},
        ];
        const trendHighData: ChartData[] = [
            {value: trendAnalysis.sevenDayHighPrice, date: now}, 
            {value: trendAnalysis.sevenDayHighPrice, date: sevenDaysAgo}, 
            {value: trendAnalysis.thirtyDayHighPrice, date: thirtyDaysAgo},
            {value: trendAnalysis.sixtyDayHighPrice, date: sixtyDaysAgo},
            {value: trendAnalysis.ninetyDayHighPrice, date: ninetyDaysAgo},
        ];
        return (
            <>
                <p className="price-data text-mono">
                    <span className="threshold" style={{ color: thresholdColor }}>
                        <b>{trendPrediction}</b>
                    </span>
                    <span
                        className="seven-day-trend"
                        style={{ color: sevenDayTrendColor }}
                    >
                        7-Day{": "}{sevenDayTrend}
                    </span>
                    <span
                        className="thirty-day-trend"
                        style={{ color: thirtyDayTrendColor }}
                    >
                        30-Day{": "}{thirtyDayTrend}
                    </span>
                    <span
                        className="sixty-day-trend"
                        style={{ color: sixtyDayTrendColor }}
                    >
                        30-60-Day{": "}{sixtyDayTrend}
                    </span>
                    <span
                        className="ninety-day-trend"
                        style={{ color: ninetyDayTrendColor }}
                    >
                        60-90-Day{": "}{ninetyDayTrend}
                    </span>
                    <Button size='small' onClick={() => setShowTrend(false)}>Real Time Data</Button>
                </p>
                <MultilineChart
                    data={[
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
                    ]}
                    dimensions={{
                        width: 1800,
                        height: 800,
                        margin: {
                            top: 20,
                            right: 30,
                            bottom: 20,
                            left: 50,
                        },
                    }}
                />
                <p className="message text-mono">{message}</p>
            </>
        )
    }
    return (
        <>
            <p className="price-data text-mono">
                <span className="price" style={{ color: priceColor }}>
                    Price{": "}${price}
                </span>
                <span className="average" style={{ color: averageColor }}>
                    Average{": "}${average}
                </span>
                <span className="threshold" style={{ color: thresholdColor }}>
                    Threshold{": "}{threshold}
                </span>
                <Button onClick={() => setShowTrend(true)}>Trend Analysis</Button>
            </p>
            <MultilineChart
                data={[
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
                    width: 1800,
                    height: 800,
                    margin: {
                        top: 20,
                        right: 30,
                        bottom: 20,
                        left: 50,
                    },
                }}
            />
            <p className="message text-mono">{message}</p>
        </>
    );
}

export default ProductPage;
