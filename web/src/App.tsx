import React, { useState } from "react";
import useWebSocket from "react-use-websocket";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import ProductPage, { ProductPageProps } from "./pages/ProductPage";
import * as formatters from "../../utils/formatters";
import "react-tabs/style/react-tabs.css";
import "./App.css";

function App() {
    const maxDataPoints = 100000;
    const initialMap = new Map<string, ProductPageProps>();
    const [productMap, setProductMap] = useState(initialMap);
    useWebSocket("ws://localhost:8080/ws", {
        onMessage: (messageEvent: WebSocketEventMap["message"]) => {
            handleMessage(messageEvent);
        },
        shouldReconnect: () => true,
    });
    const handleMessage = (messageEvent: WebSocketEventMap["message"]) => {
        const messageItems = JSON.stringify(messageEvent.data).split(",");
        const timestamp = new Date(messageItems[0]);
        const product = messageItems[1];
        const average = parseFloat(messageItems[2]);
        const price = parseFloat(messageItems[3]);
        const threshold = parseFloat(messageItems[4]);
        const message = `${formatters.formatDateMMddyyyyHHmmss(
            timestamp.toString()
        )} - Currently${messageItems[5]
            .replaceAll('"', "")
            .replaceAll("\\", "")}`;
        let map = productMap;
        let value = map.get(product);
        let data = value?.data;
        if (data) {
            data.push({ average, price, threshold, timestamp });
            if (data.length >= maxDataPoints) data.shift();
        } else {
            data = [];
        }
        map.set(product, {
            product,
            timestamp,
            price: formatNumber(price),
            average: formatNumber(average),
            threshold: formatNumber(threshold),
            message,
            data,
        });
        setProductMap(map);
    };
    const formatNumber = (number: number): string => {
        return (Math.round(number * 100) / 100).toFixed(2);
    };
    return (
        <div className="App">
            <header className="App-header">
                <Tabs>
                    <TabList>
                        {[...productMap].map(([key]) => (
                            <Tab key={key}>{key}</Tab>
                        ))}
                    </TabList>
                    {[...productMap].map(([key, value]) => (
                        <TabPanel key={key}>
                            <ProductPage
                                product={key}
                                timestamp={value.timestamp}
                                price={value.price}
                                average={value.average}
                                threshold={value.threshold}
                                message={value.message}
                                data={value.data}
                            />
                        </TabPanel>
                    ))}
                </Tabs>
            </header>
        </div>
    );
}

export default App;
