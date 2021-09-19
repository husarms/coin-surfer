import React, { useState } from "react";
import "./App.css";
import MultilineChart from "./components/MultilineChart";
import { Actions } from "../../utils/enums";
import state from "../../state/ETH-state.json";
import useWebSocket from "react-use-websocket";

const priceColor = "#5E4FA2";
const averageColor = "#A0D3FF";
const thresholdColor = "#A8DF53";
let updateCount = 0;
function App() {
    const maxDataPoints = 50000;
    const { lastMessage } = useWebSocket("ws://localhost:8080/ws", {
        onMessage: (messageEvent: WebSocketEventMap["message"]) => {
            handleMessage(messageEvent);
        },
    });
    const [messageCount, setMessageCount] = useState(0);
    const [priceData, setPriceData] = useState([]);
    const [averageData, setAverageData] = useState([]);
    const [thresholdData, setThresholdData] = useState([]);
    const handleMessage = (message) => {
        let count = messageCount;
        setMessageCount(count + 1);
        updateCount++;
        if (updateCount >= 10) {
            updateCount = 0;
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
        }
    };
    const formatNumber = (number: number): string => {
        return (Math.round(number * 100) / 100).toFixed(2);
    };
    const lastPrice = (priceData[priceData.length - 1] as any)?.value;
    const lastAverage = (averageData[priceData.length - 1] as any)?.value;
    const lastThreshold = (thresholdData[thresholdData.length - 1] as any)
        ?.value;
    return (
        <div className="App">
            <header className="App-header">
                <p style={{ marginTop: 0, fontSize: "16px" }}>
                    <span
                        style={{
                            color: priceColor,
                            fontWeight: "bold",
                            filter: "brightness(1.5)",
                            marginRight: "24px",
                        }}
                    >
                        Price{": "}${formatNumber(lastPrice)}
                    </span>
                    <span style={{ color: averageColor, marginRight: "24px" }}>
                        Average{": "}${formatNumber(lastAverage)}
                    </span>
                    <span style={{ color: thresholdColor }}>
                        Threshold{": "}${formatNumber(lastThreshold)}
                    </span>
                </p>
                <MultilineChart
                    data={[
                        {
                            name: "Price",
                            color: priceColor,
                            items: priceData,
                        },
                        {
                            name: "Average",
                            color: averageColor,
                            items: averageData,
                        },
                        {
                            name: "Threshold",
                            color: thresholdColor,
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
            </header>
        </div>
    );
}

export default App;
