import React, { useEffect, useState } from "react";
import MultilineChart from "../components/MultilineChart";
import PriceData from "../interfaces/price-data";
import { getLineOfBestFit, getSlope } from "../modeling/linear-regression";
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
    x: number[],
    y: number[],
    startIndex: number,
    data: { value: number; date: Date }[]
): { slope: number; regressionData: { value: number; date: Date }[] } => {
    const { slope, lineOfBestFit } = getLineOfBestFit(x, y);
    const regressionData = lineOfBestFit.map((value, index) => {
        return {
            value,
            date: data[(startIndex as number) + index]?.date,
        };
    });
    return { slope, regressionData };
};

function ProductPage({
    price,
    average,
    threshold,
    message,
    data,
}: ProductPageProps): JSX.Element {
    const initialDataMap = new Map<string, { value: number; date: Date }[]>();
    const [slopes, setSlopes] = useState({ longSlope: 0, shortSlope: 0 });
    const [dataMap, setDataMap] = useState(initialDataMap);

    useEffect(() => {
        setDataMap(initialDataMap);
        if (data.length <= 0) {
            return;
        }
        let currentMap = dataMap;
        const priceData = data.map((value) => {
            return { value: value.price, date: value.timestamp };
        });
        const averageData = data.map((value) => {
            return { value: value.average, date: value.timestamp };
        });
        const thresholdData = data.map((value) => {
            return { value: value.threshold, date: value.timestamp };
        });
        const shortStartIndex =
            priceData.length < 60 ? 0 : priceData.length - 60;
        const longStartIndex =
            priceData.length < 360 ? 0 : priceData.length - 360;
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
        currentMap.set("price-data", priceData);
        currentMap.set("average-data", averageData);
        currentMap.set("threshold-data", thresholdData);
        currentMap.set(
            "long-regression-data",
            longRegressionData.regressionData
        );
        currentMap.set(
            "short-regression-data",
            shortRegressionData.regressionData
        );
        const longSlope = getSlope(
            { x: longXs[0], y: longYs[0] },
            { x: longXs[longXs.length - 1], y: longYs[longYs.length - 1] }
        );
        const shortSlope = getSlope(
            { x: shortXs[0], y: shortYs[0] },
            { x: shortXs[shortXs.length - 1], y: shortYs[shortYs.length - 1] }
        );
        setSlopes({
            longSlope,
            shortSlope,
        });
        setDataMap(currentMap);
    }, [data]);
    const averageData = dataMap.get("average-data");
    const priceData = dataMap.get("price-data");
    const thresholdData = dataMap.get("threshold-data");
    const longRegressionData = dataMap.get("long-regression-data");
    const shortRegressionData = dataMap.get("short-regression-data");
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
                    className="long-slope"
                    style={{ color: longRegressionColor }}
                >
                    {`Long Slope: ${slopes.longSlope.toFixed(2)}`}
                </span>
                <span
                    className="short-slope"
                    style={{ color: shortRegressionColor }}
                >
                    {`Short Slope: ${slopes.shortSlope.toFixed(2)}`}
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
                        name: "Regression",
                        color: longRegressionColor,
                        items: longRegressionData ? longRegressionData : [],
                        strokeWidth: 2,
                    },
                    {
                        name: "Regression",
                        color: shortRegressionColor,
                        items: shortRegressionData ? shortRegressionData : [],
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
