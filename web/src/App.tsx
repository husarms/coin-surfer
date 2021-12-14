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
        const { thirtyDayAverage, sevenDayAverage, sevenDayLowThreshold, sevenDayHighThreshold } = trendAnalysis;
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
        let historicalAverageData = value?.historicalAverageData;
        if (historicalAverageData) {
            historicalAverageData.push({ value: thirtyDayAverage, date: new Date(timestamp) });
            if (historicalAverageData.length >= maxDataPoints) historicalAverageData.shift();
        } else {
            historicalAverageData = [];
        }
        let thresholdData = value?.thresholdData;
        if (thresholdData) {
            thresholdData.push({ value: threshold, date: new Date(timestamp) });
            if (thresholdData.length >= maxDataPoints) thresholdData.shift();
        } else {
            thresholdData = [];
        }
        const thirtyDayConfidenceScore= formatNumber(((averagePrice - thirtyDayAverage) / thirtyDayAverage) * 100);
        const sevenDayConfidenceScore = formatNumber(((averagePrice - sevenDayAverage) / sevenDayAverage) * 100);
        const thirtyDayTrend = `$${formatNumber(thirtyDayAverage)} (${thirtyDayConfidenceScore}%)`;
        const sevenDayTrend = `-${formatNumber(sevenDayLowThreshold)}% / ${formatNumber(sevenDayHighThreshold)}% (${sevenDayConfidenceScore}%)`;
        map.set(product, {
            product: product,
            timestamp,
            price: formatNumber(price),
            priceData,
            average: formatNumber(averagePrice),
            averageData,
            historicalAverage: formatNumber(thirtyDayAverage),
            historicalAverageData,
            threshold: formatNumber(threshold),
            thresholdData,
            thirtyDayTrend,
            sevenDayTrend,
            message: statusMessage,
        });
        setProductMap(map);
    };
    const formatNumber = (number: number): string => {
        return (Math.round(number * 100) / 100).toFixed(2);
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
                                historicalAverage={value.historicalAverage}
                                historicalAverageData={value.historicalAverageData}
                                threshold={value.threshold}
                                thresholdData={value.thresholdData}
                                thirtyDayTrend={value.thirtyDayTrend}
                                sevenDayTrend={value.sevenDayTrend}
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
