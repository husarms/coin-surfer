import React, { useState } from "react";
import "./App.css";
import MultilineChart from "./components/MultilineChart";
import { Actions } from "../../utils/enums";
import state from "../../state/ETH-state.json";
import useWebSocket from "react-use-websocket";

function App() {
    const maxDataPoints = 100000;
    const { lastMessage } = useWebSocket("ws://localhost:8080/ws", {
        onMessage: (messageEvent: WebSocketEventMap["message"]) => {
            handleMessage(messageEvent);
        },
    });
    const [clickCount, setClickCount] = useState(0);
    const [messageCount, setMessageCount] = useState(0);
    const [priceData, setPriceData] = useState([]);
    const [averageData, setAverageData] = useState([]);
    const [thresholdData, setThresholdData] = useState([]);

    const handleMessage = (message) => {
        let count = messageCount;
        setMessageCount(count + 1);
        const timestamp = new Date();
        const { price, low_24h, high_24h } = JSON.parse(message.data);
        const average =
            (parseFloat(high_24h) - parseFloat(low_24h)) / 2 +
            parseFloat(low_24h);

        const threshold =
            state.action === Actions.Buy
                ? state.buyThreshold
                : state.sellThreshold;

        let data = priceData;
        (data as any).push({ value: parseFloat(price), date: timestamp });
        if (data.length >= maxDataPoints) data.shift();
        setPriceData(data);

        data = averageData;
        (data as any).push({ value: average, date: timestamp });
        if (data.length >= maxDataPoints) data.shift();
        setAverageData(data);

        data = thresholdData;
        (data as any).push({ value: threshold, date: timestamp });
        if (data.length >= maxDataPoints) data.shift();
        setThresholdData(data);
    };
    const handleClick = (e) => {
        e.preventDefault();
        const count = clickCount;
        setClickCount(count + 1);
    };
    const formatNumber = (number: number): string => {
        return (Math.round(number * 100) / 100).toFixed(2);
    }
    const lastPrice = (priceData[priceData.length - 1] as any)?.value;
    const lastThreshold = (thresholdData[thresholdData.length - 1] as any)
        ?.value;
    return (
        <div className="App">
            <header className="App-header">
                <p style={{ fontSize: "14px" }}>
                    Price: ${formatNumber(lastPrice)} - Threshold: ${formatNumber(lastThreshold)} - Data
                    length: {priceData.length}
                </p>
                <MultilineChart
                    data={[
                        {
                            name: "Price",
                            color: "#5E4FA2",
                            items: priceData,
                        },
                        {
                            name: "Average",
                            color: "#A0D3FF",
                            items: averageData,
                        },
                        {
                            name: "Threshold",
                            color: "#A8DF53",
                            items: thresholdData,
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
                <button
                    onClick={handleClick}
                    style={{
                        fontSize: "14px",
                        backgroundColor: "black",
                        color: "white",
                    }}
                >
                    This has been clicked {clickCount} times
                </button>
            </header>
        </div>
    );
}

export default App;
