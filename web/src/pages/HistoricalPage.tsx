import React from "react";
import MultilineChart from "../components/MultilineChart";
import PriceData from "../interfaces/price-data";
import "./ProductPage.scss";

const priceColor = "#5E4FA2";
const averageColor = "#A0D3FF";
const thresholdColor = "#A8DF53";

export interface HistoricalPageProps {
    title: string;
    data: PriceData[];
    goBack: () => void;
}

function HistoricalPage({ title, data, goBack }: HistoricalPageProps): JSX.Element {
    console.log(data);
    const priceData = data.map((value) => {
        return { value: value.price, date: new Date(value.timestamp) };
    });
    const averageData = data.map((value) => {
        return { value: value.average, date: new Date(value.timestamp) };
    });
    const thresholdData = data.map((value) => {
        return { value: value.threshold, date: new Date(value.timestamp) };
    });
    return (
        <>
            <p className="price-data">{title}</p>
            <MultilineChart
                data={[
                    {
                        name: "Average",
                        color: averageColor,
                        items: averageData,
                    },
                    {
                        name: "Price",
                        color: priceColor,
                        items: priceData,
                    },
                    {
                        name: "Threshold",
                        color: thresholdColor,
                        items: thresholdData,
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
            <button className="link-button" onClick={goBack}>Go Back</button>
        </>
    );
}

export default HistoricalPage;
