import React, { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

import LogEntry from "./interfaces/log-entry";
import PriceData from "./interfaces/price-data";
import ProductPage, { ProductPageProps } from "./pages/ProductPage";
import HistoricalPage from "./pages/HistoricalPage";
import * as formatters from "../../utils/formatters";
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
    const parseLogEntry = (logEntryString: string): LogEntry => {
        const messageItems = JSON.stringify(logEntryString).split(",");
        const timestamp = new Date(messageItems[0]);
        const product = messageItems[1];
        const average = parseFloat(messageItems[2]);
        const historicalAverage = parseFloat(messageItems[3])
        const price = parseFloat(messageItems[4]);
        const threshold = parseFloat(messageItems[5]);
        const message = `${formatters.formatDateMMddyyyyHHmmss(
            timestamp.toString()
        )} - Currently${messageItems[6]
            .replaceAll('"', "")
            .replaceAll("\\", "")}`;
        return { product, timestamp, price, average, historicalAverage, threshold, message };
    };
    const getHistoricalFiles = () => {
        fetch("_manifest.json")
            .then((res) => res.json())
            .then((data) => {
                data.sort();
                setHistoricalFiles(data);
            });
    };
    const handleMessage = (messageEvent: WebSocketEventMap["message"]) => {
        const { product, timestamp, price, average, historicalAverage, threshold, message } =
            parseLogEntry(messageEvent.data);
        let map = productMap;
        let value = map.get(product);
        let priceData = value?.priceData;
        if (priceData) {
            priceData.push({ value: price, date: timestamp });
            if (priceData.length >= maxDataPoints) priceData.shift();
        } else {
            priceData = [];
        }
        let averageData = value?.averageData;
        if (averageData) {
            averageData.push({ value: average, date: timestamp });
            if (averageData.length >= maxDataPoints) averageData.shift();
        } else {
            averageData = [];
        }
        let historicalAverageData = value?.historicalAverageData;
        if (historicalAverageData) {
            historicalAverageData.push({ value: historicalAverage, date: timestamp });
            if (historicalAverageData.length >= maxDataPoints) historicalAverageData.shift();
        } else {
            historicalAverageData = [];
        }
        let thresholdData = value?.thresholdData;
        if (thresholdData) {
            thresholdData.push({ value: threshold, date: timestamp });
            if (thresholdData.length >= maxDataPoints) thresholdData.shift();
        } else {
            thresholdData = [];
        }
        const confidenceScore = ((average - historicalAverage) / historicalAverage) * 100;
        map.set(product, {
            product,
            timestamp,
            price: formatNumber(price),
            priceData: priceData,
            average: formatNumber(average),
            averageData: averageData,
            historicalAverage: formatNumber(historicalAverage),
            historicalAverageData: historicalAverageData,
            threshold: formatNumber(threshold),
            thresholdData: thresholdData,
            confidenceScore: formatNumber(confidenceScore),
            message,
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
                                confidenceScore={value.confidenceScore}
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
