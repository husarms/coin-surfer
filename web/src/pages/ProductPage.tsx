import React from "react";
import MultilineChart from "../components/MultilineChart";
import PriceData from "../interfaces/price-data";
import { getLineOfBestFit } from "../modeling/linear-regression";
import "./ProductPage.scss";

const priceColor = "#5E4FA2";
const averageColor = "#A0D3FF";
const thresholdColor = "#A8DF53";
const longRegressionColor = "#FFB969";
const shortRegressionColor = "#F5FF69";

export interface ProductPageProps {
    product: string;
    timestamp: Date;
    price: string;
    average: string;
    threshold: string;
    message: string;
    data: PriceData[];
}

const getRegressionData = (
    x: Number[],
    y: Number[],
    startIndex: Number,
    data: { value: Number; date: Date }[]
): { value: Number; date: Date }[] => {
    const { slope, lineOfBestFit } = getLineOfBestFit(x, y);
    const regressionData = lineOfBestFit.map((value, index) => {
        return {
            value,
            date: data[startIndex as number + index]?.date,
        };
    });
    return regressionData;
};

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
    const shortStartIndex = priceData.length < 60 ? 0 : priceData.length - 60;
    const longStartIndex = priceData.length < 640 ? 0 : priceData.length - 640;
    const shortEndIndex = priceData.length <= 0 ? 0 : priceData.length - 1;
    const longEndIndex = priceData.length <= 60 ? 0 : priceData.length - 59;
    const longSegment = priceData.slice(longStartIndex, longEndIndex);
    const shortSegment = priceData.slice(shortStartIndex, shortEndIndex);
    const longYs = longSegment.map((value) => {
        return value.value;
    });
    const longXs = longSegment.map((value, index) => {
        return index;
    });
    const shortYs = shortSegment.map((value) => {
        return value.value;
    });
    const shortXs = shortSegment.map((value, index) => {
        return index;
    });
    const longRegressionData = getRegressionData(
        longXs,
        longYs,
        longStartIndex,
        priceData
    );
    const shortRegressionData = getRegressionData(
        shortXs,
        shortYs,
        shortStartIndex,
        priceData
    );
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
                        strokeWidth: 2,
                    },
                    {
                        name: "Price",
                        color: priceColor,
                        items: priceData,
                        strokeWidth: 3,
                    },
                    {
                        name: "Threshold",
                        color: thresholdColor,
                        items: thresholdData,
                        strokeWidth: 2,
                    },
                    {
                        name: "Regression",
                        color: longRegressionColor,
                        items: longRegressionData,
                        strokeWidth: 2,
                    },
                    {
                        name: "Regression",
                        color: shortRegressionColor,
                        items: shortRegressionData,
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
