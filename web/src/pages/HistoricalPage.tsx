import React, { useEffect, useState } from "react";
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

interface ChartProps {
    color: string;
    items: PriceData[];
}

function findLineByLeastSquares(values_x, values_y) {
    var x_sum = 0;
    var y_sum = 0;
    var xy_sum = 0;
    var xx_sum = 0;
    var count = 0;

    // The above is just for quick access, makes the program faster
    var x = 0;
    var y = 0;
    var values_length = values_x.length;
    if (values_length != values_y.length) {
        throw new Error(
            "The parameters values_x and values_y need to have same size!"
        );
    }
    // Above and below cover edge cases
    if (values_length === 0) {
        return [[], []];
    }
    // Calculate the sum for each of the parts necessary.
    for (let i = 0; i < values_length; i++) {
        x = values_x[i];
        y = values_y[i];
        x_sum += x;
        y_sum += y;
        xx_sum += x * x;
        xy_sum += x * y;
        count++;
    }
    // Calculate m and b for the line equation: m * x + b
    var m = (count * xy_sum - x_sum * y_sum) / (count * xx_sum - x_sum * x_sum);
    var b = y_sum / count - (m * x_sum) / count;
    // We then return the x and y data points according to our fit
    var result_values_x = [] as Number[];
    var result_values_y = [] as Number[];
    for (let i = 0; i < values_length; i++) {
        x = values_x[i];
        y = x * m + b;
        result_values_x.push(x);
        result_values_y.push(y);
    }
    //return [result_values_x, result_values_y];
    return result_values_y;
}

function HistoricalPage({
    title,
    data,
    goBack,
}: HistoricalPageProps): JSX.Element {
    const initialDataMap = new Map<string, ChartProps>();
    const [dataMap, setDataMap] = useState(initialDataMap);

    useEffect(() => {
        if (data.length <= 0) {
            return;
        }
        const mappedPriceData = data.map((value) => {
            return { value: value.price, date: new Date(value.timestamp) };
        });
        const mappedAverageData = data.map((value) => {
            return { value: value.average, date: new Date(value.timestamp) };
        });
        let currentDataMap = dataMap;
        currentDataMap.set("Price Data", {
            color: priceColor,
            items: mappedPriceData as any,
        });
        currentDataMap.set("Average Data", {
            color: averageColor,
            items: mappedAverageData as any,
        });
        const numberOfSegments = 10;
        const segmentLength = Math.round(mappedPriceData.length / numberOfSegments);
        console.log(`Number of segments = ${numberOfSegments}`);
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
            const lineOfBestFit = findLineByLeastSquares(xval, yval);
            const mappedLinearProgressionData = lineOfBestFit.map(
                (value, index) => {
                    return {
                        value,
                        date: mappedPriceData[index + startIndex]?.date,
                    };
                }
            );
            currentDataMap.set(`Regression ${startIndex + 1}`, {
                color: thresholdColor,
                items: mappedLinearProgressionData as any,
            });
        }
        console.log(currentDataMap);
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
