import React, { useState } from "react";
import useWebSocket from "react-use-websocket";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

import SurfState from "../../interfaces/surf-state";
import { Actions } from "../../utils/enums";
import ProductPage, { ProductPageProps } from "./pages/ProductPage";
import AboutPage  from "./pages/AboutPage";
import "react-tabs/style/react-tabs.css";
import "./App.scss";

function formatTrendAnalysis(historicalAverage: number, lowPrice: number, highPrice: number): string {
    return `$${formatRoughNumber(lowPrice)} - $${formatRoughNumber(highPrice)} ($${formatRoughNumber(historicalAverage)})`;
}

function getTrendPrediction(sevenDayAverage: number, thirtyDayAverage: number, sixtyDayAverage: number, ninetyDayAverage: number): string {
    const sevenDayDifference = ((sevenDayAverage - thirtyDayAverage) / sevenDayAverage) * 100;
    const thirtyDayDifference = ((thirtyDayAverage - sixtyDayAverage) / thirtyDayAverage) * 100;
    const sixtyDayDifference = ((sixtyDayAverage - ninetyDayAverage) / sixtyDayAverage) * 100;
    let tide = 'N/A';
    // Leveling out
    if(Math.abs(sevenDayDifference) < 5) {
        // previous drop
        if(thirtyDayDifference < -5) {
            tide = 'Low Tide';
        }
        // previous rise
        if(thirtyDayDifference > 5) {
            tide = 'High Tide';
        }
    } else {
        // currently rising
        if(sevenDayDifference > 5) {
            tide = 'Rising Tide';
        }
        // currently falling
        if(sevenDayDifference < -5) {
            tide = 'Falling Tide'
        }
    }
    return tide;
}

const formatNumber = (number: number): string => {
    return (Math.round(number * 100) / 100).toFixed(2);
};

const formatRoughNumber = (number: number): string => {
    if(number >= 100) {
        return number.toFixed(0);
    }
    return number.toFixed(2);
}

function App() {
    const maxDataPoints = 100000;
    const initialMap = new Map<string, ProductPageProps>();
    const [productMap, setProductMap] = useState(initialMap);
    useWebSocket((window as any).coinSurferWebSocketUrl, {
        onMessage: (messageEvent: WebSocketEventMap["message"]) => {
            handleMessage(messageEvent);
        },
        shouldReconnect: () => true,
    });
    const handleMessage = (messageEvent: WebSocketEventMap["message"]) => {
        const surfStates = JSON.parse(messageEvent.data) as SurfState[];
        let map = productMap;
        for (let surfState of surfStates) {
            const { parameters, timestamp, price, averagePrice, trendAnalysis, buyThreshold, sellThreshold, statusMessage, action } = surfState;
            const { ninetyDayAverage, ninetyDayLowPrice, ninetyDayHighPrice, sixtyDayAverage, sixtyDayLowPrice, sixtyDayHighPrice, thirtyDayAverage, thirtyDayLowPrice, thirtyDayHighPrice, sevenDayAverage, sevenDayLowPrice, sevenDayHighPrice } = trendAnalysis;
            const product = parameters.cryptoCurrency;
            const threshold = action === Actions.Buy ? buyThreshold : sellThreshold;
            let value = map.get(product);
            let priceData = value?.priceData;
            if (priceData) {
                priceData.push({ value: price, date: new Date(timestamp) });
                if (priceData.length >= maxDataPoints) priceData.shift();
            } else {
                priceData = [];
            }
            let averageData = value?.averageData;
            if (averageData) {
                averageData.push({ value: averagePrice, date: new Date(timestamp) });
                if (averageData.length >= maxDataPoints) averageData.shift();
            } else {
                averageData = [];
            }
            let sevenDayAverageData = value?.sevenDayAverageData;
            if (sevenDayAverageData) {
                sevenDayAverageData.push({ value: sevenDayAverage, date: new Date(timestamp) });
                if (sevenDayAverageData.length >= maxDataPoints) sevenDayAverageData.shift();
            } else {
                sevenDayAverageData = [];
            }
            let thirtyDayAverageData = value?.thirtyDayAverageData;
            if (thirtyDayAverageData) {
                thirtyDayAverageData.push({ value: thirtyDayAverage, date: new Date(timestamp) });
                if (thirtyDayAverageData.length >= maxDataPoints) thirtyDayAverageData.shift();
            } else {
                thirtyDayAverageData = [];
            }
            let thresholdData = value?.thresholdData;
            if (thresholdData) {
                thresholdData.push({ value: threshold, date: new Date(timestamp) });
                if (thresholdData.length >= maxDataPoints) thresholdData.shift();
            } else {
                thresholdData = [];
            }
            const sevenDayTrend = formatTrendAnalysis(sevenDayAverage, sevenDayLowPrice, sevenDayHighPrice);
            const thirtyDayTrend = formatTrendAnalysis(thirtyDayAverage, thirtyDayLowPrice, thirtyDayHighPrice);
            const sixtyDayTrend = formatTrendAnalysis(sixtyDayAverage, sixtyDayLowPrice, sixtyDayHighPrice);
            const ninetyDayTrend = formatTrendAnalysis(ninetyDayAverage, ninetyDayLowPrice, ninetyDayHighPrice);
            const thresholdMargin = Math.abs(((sellThreshold - buyThreshold) / sellThreshold) * 100);
            const thresholdSummary = `$${formatRoughNumber(buyThreshold)} - $${formatRoughNumber(sellThreshold)} (${formatNumber(thresholdMargin)}%)`;
            const trendPrediction = getTrendPrediction(sevenDayAverage, thirtyDayAverage, sixtyDayAverage, ninetyDayAverage);
            map.set(product, {
                product: product,
                timestamp,
                price: formatNumber(price),
                priceData,
                average: formatNumber(averagePrice),
                averageData,
                sevenDayAverage: formatNumber(sevenDayAverage),
                sevenDayAverageData,
                thirtyDayAverage: formatNumber(thirtyDayAverage),
                thirtyDayAverageData,
                threshold: thresholdSummary,
                thresholdData,
                sevenDayTrend,
                thirtyDayTrend,
                sixtyDayTrend,
                ninetyDayTrend,
                trendPrediction,
                trendAnalysis,
                message: statusMessage,
            });
        }
        setProductMap(map);
    };
    return (
        <div className="App">
            <header className="App-header">
                <Tabs>
                    <TabList>
                        <Tab key="about">About</Tab>
                        {[...productMap].map(([key]) => (
                            <Tab key={key}>{key}</Tab>
                        ))}
                    </TabList>
                    <TabPanel key="about">
                        <AboutPage />
                    </TabPanel>
                    {[...productMap].map(([key, value]) => (
                        <TabPanel key={key}>
                            <ProductPage
                                product={key}
                                timestamp={value.timestamp}
                                price={value.price}
                                priceData={value.priceData}
                                average={value.average}
                                averageData={value.averageData}
                                sevenDayAverage={value.sevenDayAverage}
                                sevenDayAverageData={value.sevenDayAverageData}
                                thirtyDayAverage={value.thirtyDayAverage}
                                thirtyDayAverageData={value.thirtyDayAverageData}
                                threshold={value.threshold}
                                thresholdData={value.thresholdData}
                                sevenDayTrend={value.sevenDayTrend}
                                thirtyDayTrend={value.thirtyDayTrend}
                                sixtyDayTrend={value.sixtyDayTrend}
                                ninetyDayTrend={value.ninetyDayTrend}
                                trendPrediction={value.trendPrediction}
                                trendAnalysis={value.trendAnalysis}
                                message={value.message}
                            />
                        </TabPanel>
                    ))}
                </Tabs>
            </header>
        </div>
    );
}

export default App;
