import React, { useEffect, useState } from "react";
import MultilineChart from "../components/MultilineChart";
import PriceData from "../interfaces/price-data";
import { getLineOfBestFit } from "../modeling/linear-regression";
import "./ProductPage.scss";

const priceColor = "#5E4FA2";
const averageColor = "#A0D3FF";
const thresholdColor = "#A8DF53";
const regressionColor = "#FFB969";

export interface HistoricalPageProps {
    title: string;
    data: PriceData[];
    goBack: () => void;
}

interface ChartProps {
    color: string;
    strokeWidth: number;
    items: PriceData[];
}

function HistoricalPage({
    title,
    data,
    goBack,
}: HistoricalPageProps): JSX.Element {
    const initialDataMap = new Map<string, ChartProps>();
    const [dataMap, setDataMap] = useState(initialDataMap);

    useEffect(() => {
        setDataMap(initialDataMap);
        if (data.length <= 0) {
            return;
        }
        const mappedPriceData = data.map((value) => {
            return { value: value.price, date: new Date(value.timestamp) };
        });
        const mappedAverageData = data.map((value) => {
            return { value: value.average, date: new Date(value.timestamp) };
        });
        const mappedThresholdData = data.map((value) => {
            return { value: value.threshold, date: new Date(value.timestamp) };
        });
        let currentDataMap = dataMap;
        currentDataMap.set("Price Data", {
            color: priceColor,
            strokeWidth: 3,
            items: mappedPriceData as any,
        });
        currentDataMap.set("Average Data", {
            color: averageColor,
            strokeWidth: 2,
            items: mappedAverageData as any,
        });
        currentDataMap.set("Threshold Data", {
            color: thresholdColor,
            strokeWidth: 2,
            items: mappedThresholdData as any,
        });
        const segmentLength = 360;
        const numberOfSegments = Math.round(mappedPriceData.length / segmentLength);
        for (let i = 0; i <= numberOfSegments; i++) {
            const startIndex = i * segmentLength;
            const endIndex = (i + 1) * segmentLength;
            const segment = mappedPriceData.slice(startIndex, endIndex);
            const yval = segment.map((value) => {
                return value.value;
            });
            const xval = segment.map((value, index) => {
                return index;
            });
            const { slope, lineOfBestFit } = getLineOfBestFit(xval, yval);
            const mappedLinearProgressionData = lineOfBestFit.map(
                (value, index) => {
                    return {
                        value,
                        date: mappedPriceData[index + startIndex]?.date,
                    };
                }
            );
            currentDataMap.set(`Regression ${i}`, {
                color: regressionColor,
                strokeWidth: 2,
                items: mappedLinearProgressionData as any,
            });;
        }
        setDataMap(currentDataMap);
    }, [data]);
    return (
        <>
            <p className="price-data">{title}</p>
            {dataMap.size > 0 && (
                <MultilineChart
                    data={[...dataMap].map(([key, value]) => {
                        return {
                            name: key,
                            color: value.color,
                            items: value.items,
                            strokeWidth: value.strokeWidth,
                        };
                    })}
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
            )}
            <button className="link-button" onClick={goBack}>
                Go Back
            </button>
        </>
    );
}

export default HistoricalPage;
