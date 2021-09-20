import React from "react";
import MultilineChart from "../components/MultilineChart";
import { PriceData } from "../interfaces/price-data";
import "./ProductPage.css";

const priceColor = "#5E4FA2";
const averageColor = "#A0D3FF";
const thresholdColor = "#A8DF53";

export interface ProductPageProps {
    product: string;
    timestamp: Date;
    price: string;
    average: string;
    threshold: string;
    message: string;
    data: PriceData[];
}

function ProductPage({
    price,
    average,
    threshold,
    message,
    data,
}: ProductPageProps): JSX.Element {
    const priceData = data.map((value) => {
        return { value: value.price, date: value.timestamp };
    });
    const averageData = data.map((value) => {
        return { value: value.average, date: value.timestamp };
    });
    const thresholdData = data.map((value) => {
        return { value: value.threshold, date: value.timestamp };
    });
    return (
        <>
            <p className="price-data">
                <span className="price" style={{ color: priceColor }}>
                    Price{": "}${price}
                </span>
                <span className="average" style={{ color: averageColor }}>
                    Average{": "}${average}
                </span>
                <span style={{ color: thresholdColor }}>
                    Threshold{": "}${threshold}
                </span>
            </p>
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
            <p className="message">{message}</p>
        </>
    );
}

export default ProductPage;
