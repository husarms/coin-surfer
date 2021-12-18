import React, { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

import PriceData from "./interfaces/price-data";
import SurfState from "../../interfaces/surf-state";
import { Actions } from "../../utils/enums";
import ProductPage, { ProductPageProps } from "./pages/ProductPage";
import HistoricalPage from "./pages/HistoricalPage";
import "react-tabs/style/react-tabs.css";
import "./App.scss";

function formatTrendAnalysis(price: number, historicalAverage: number, lowThreshold: number, highThreshold: number): string {
    const upOrDown = price > historicalAverage ? '▲' : '▼';
    let indicator = upOrDown;
    const confidenceScore = ((price - historicalAverage) / historicalAverage) * 100;
    const multiplier = Math.floor(Math.abs(confidenceScore) / 5);
    for (var i = 0; i < multiplier; i++) {
        indicator += upOrDown;
    }
    return `$${formatNumber(historicalAverage)} (${formatNumber(confidenceScore)}%) ${indicator} -${formatNumber(lowThreshold)}% / +${formatNumber(highThreshold)}%`;
}

const formatNumber = (number: number): string => {
    return (Math.round(number * 100) / 100).toFixed(2);
};

function App() {
    const maxDataPoints = 100000;
    const initialMap = new Map<string, ProductPageProps>();
    const [productMap, setProductMap] = useState(initialMap);
    const [historicalFiles, setHistoricalFiles] = useState([]);
    const [historicalFile, setHistoricalFile] = useState("");
    const [historicalData, setHistoricalData] = useState([] as PriceData[]);
    useEffect(() => {
        getHistoricalFiles();
    }, []);
    useWebSocket("ws://localhost:8080/ws", {
        onMessage: (messageEvent: WebSocketEventMap["message"]) => {
            handleMessage(messageEvent);
        },
        shouldReconnect: () => true,
    });
    const getHistoricalFiles = () => {
        fetch("_manifest.json")
            .then((res) => res.json())
            .then((data) => {
                data.sort();
                setHistoricalFiles(data);
            });
    };
    const handleMessage = (messageEvent: WebSocketEventMap["message"]) => {
        const surfState = JSON.parse(messageEvent.data) as SurfState;
        const { parameters, timestamp, price, averagePrice, trendAnalysis, buyThreshold, sellThreshold, statusMessage, action } = surfState;
        const { thirtyDayAverage, thirtyDayLowThreshold, thirtyDayHighThreshold, sevenDayAverage, sevenDayLowThreshold, sevenDayHighThreshold } = trendAnalysis;
        const product = parameters.cryptoCurrency;
        const threshold = action === Actions.Buy ? buyThreshold : sellThreshold;
        let map = productMap;
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
        const sevenDayTrend = formatTrendAnalysis(price, sevenDayAverage, sevenDayLowThreshold, sevenDayHighThreshold);
        const thirtyDayTrend = formatTrendAnalysis(price, thirtyDayAverage, thirtyDayLowThreshold, thirtyDayHighThreshold);
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
            threshold: formatNumber(threshold),
            thresholdData,
            sevenDayTrend,
            thirtyDayTrend,
            message: statusMessage,
        });
        setProductMap(map);
    };
    const selectHistoricalFile = (fileName: string) => {
        setHistoricalFile(fileName);
        fetch(fileName)
            .then((res) => res.json())
            .then((data) => {
                setHistoricalData(data);
            });
    };
    return (
        <div className="App">
            <header className="App-header">
                <Tabs>
                    <TabList>
                        {[...productMap].map(([key]) => (
                            <Tab key={key}>{key}</Tab>
                        ))}
                        <Tab key="history">Historical Data</Tab>
                    </TabList>
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
                                message={value.message}
                            />
                        </TabPanel>
                    ))}
                    <TabPanel key="history">
                        {historicalFile === "" ? (
                            <div className="grid-container">
                                {historicalFiles.map((value) => (
                                    <div key={value} className="grid-item">
                                        <button className="link-button"
                                            onClick={() =>
                                                selectHistoricalFile(value)
                                            }
                                        >
                                            {value}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <HistoricalPage
                                title={historicalFile}
                                data={historicalData}
                                goBack={() => setHistoricalFile("")}
                            />
                        )}
                    </TabPanel>
                </Tabs>
            </header>
        </div>
    );
}

export default App;
