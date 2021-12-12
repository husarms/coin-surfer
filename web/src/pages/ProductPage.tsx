import React from "react";
import MultilineChart from "../components/MultilineChart";
import ChartData from "../interfaces/chart-data";
import "./ProductPage.scss";

const priceColor = "#5E4FA2";
const averageColor = "#A0D3FF";
const thresholdColor = "#A8DF53";
const historicalAverageColor = "#C7BA00";

export interface ProductPageProps {
    product: string;
    timestamp: Date;
    price: string;
    priceData: ChartData[];
    average: string;
    averageData: ChartData[];
    historicalAverage: string;
    historicalAverageData: ChartData[];
    threshold: string;
    thresholdData: ChartData[];
    historicalAnalysis: string;
    message: string;
}

function ProductPage({
    price,
    priceData,
    average,
    averageData,
    historicalAverageData,
    threshold,
    thresholdData,
    historicalAnalysis,
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
                    Threshold{": "}${threshold}
                </span>
                <span
                    className="historical-average"
                    style={{ color: historicalAverageColor }}
                >
                    Historical{": "}{historicalAnalysis}
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
                        name: "HistoricalAverage",
                        color: historicalAverageColor,
                        items: historicalAverageData ? historicalAverageData : [],
                        strokeWidth: 2,
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
