import React from "react";
import MultilineChart from "../components/MultilineChart";
import ChartData from "../interfaces/chart-data";
import "./ProductPage.scss";

const priceColor = "#5E4FA2";
const averageColor = "#A0D3FF";
const thresholdColor = "#A8DF53";
const sevenDayTrendColor = "#C7BA00";
const thirtyDayTrendColor = "#C98C3C";

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
    message: string;
}

function ProductPage({
    price,
    priceData,
    average,
    averageData,
    sevenDayAverage,
    sevenDayAverageData,
    thirtyDayAverage,
    thirtyDayAverageData,
    threshold,
    thresholdData,
    sevenDayTrend,
    thirtyDayTrend,
    message,
}: ProductPageProps): JSX.Element {
    return (
        <>
            <p className="price-data">
                <span className="price" style={{ color: priceColor }}>
                    Price{": "}${price}
                </span>
                <span className="average" style={{ color: averageColor }}>
                    Average{": "}${average}
                </span>
                <span className="threshold" style={{ color: thresholdColor }}>
                    Threshold{": "}{threshold}
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
            <p className="message">{message}</p>
        </>
    );
}

export default ProductPage;
