import React from "react";
import MultilineChart from "../components/MultilineChart";
import { PriceData } from "../interfaces/price-data";

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
            <p style={{ marginTop: 0, fontSize: "16px" }}>
                <span
                    style={{
                        color: priceColor,
                        fontWeight: "bold",
                        filter: "brightness(1.5)",
                        marginRight: "24px",
                    }}
                >
                    Price{": "}${price}
                </span>
                <span style={{ color: averageColor, marginRight: "24px" }}>
                    Average{": "}${average}
                </span>
                <span style={{ color: thresholdColor }}>
                    Threshold{": "}${threshold}
                </span>
            </p>
            <MultilineChart
                data={[
                    {
                        name: "Price",
                        color: priceColor,
                        items: priceData,
                    },
                    {
                        name: "Average",
                        color: averageColor,
                        items: averageData,
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
            <p style={{ marginTop: 0, fontSize: "16px" }}>{message}</p>
        </>
    );
}

export default ProductPage;
