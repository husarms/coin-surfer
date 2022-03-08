import React, { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import SurfState from "../../interfaces/surf-state";
import ProductPage, { ProductPageProps } from "./pages/ProductPage";
import AboutPage  from "./pages/AboutPage";
import { MapSurfStatesToProductMap } from "./utils/mappers";
import "./styles/index.scss";

const requestBackgroundProcessStart = () => {
    const http = new XMLHttpRequest();
    const url = `${location.origin}/start`;
    http.open('GET', url);
    http.send();
}

function App() {
    const initialMap = new Map<string, ProductPageProps>();
    const [productMap, setProductMap] = useState(initialMap);
    useEffect(() => {
        requestBackgroundProcessStart();
    }, []);
    useWebSocket(location.origin.replace(/^http/, 'ws').replace('localhost:3000', 'localhost:5000') + '/ws', {
        onMessage: (messageEvent: WebSocketEventMap["message"]) => {
            handleMessage(messageEvent);
        },
        shouldReconnect: () => true,
    });
    const handleMessage = (messageEvent: WebSocketEventMap["message"]) => {
        const surfStates = JSON.parse(messageEvent.data) as SurfState[];
        const map = MapSurfStatesToProductMap(productMap, surfStates);
        setProductMap(map);
    };
    return (
        <main>
            <Tabs>
                <TabList>
                    <Tab key="about">About</Tab>
                    {[...productMap].map(([key]) => (
                        <Tab key={key}>{key}</Tab>
                    ))}
                </TabList>
                <TabPanel key="about">
                    <AboutPage isLoading={productMap.size <= 0} />
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
                            oneTwentyDayTrend={value.oneTwentyDayTrend}
                            trendPrediction={value.trendPrediction}
                            trendAnalysis={value.trendAnalysis}
                            message={value.message}
                        />
                    </TabPanel>
                ))}
            </Tabs>
        </main>
    );
}

export default App;
