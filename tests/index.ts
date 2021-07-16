import * as SimpleThresholdSurfer from "./surfers/simple-threshold";
import * as PeakValleyTrendSurfer from "./surfers/peak-valley-trend";
import * as TimeTravelSurfer from "./surfers/time-travel";
import * as DataProvider from "./data/data-provider";
import * as CoinbaseGateway from "../gateways/coinbase-gateway";
import { Candle } from "coinbase-pro-node";
import { Products } from "../utils/enums";
import * as Formatters from "../utils/formatters";

const budget = 1000;
// const data = DataProvider.readFromCsvFile("data-ltc-0605-0609.csv");
// const historicalData = DataProvider.readFromJsonFile("historical-ada-0525-0530.json");

// var start = 1000;
// for(var i = 1; i < 139; i++){
//     start += (start * 0.03);
//     console.log(`Cash = $${start.toFixed(2)}`);
// }

// let bestResult = 0;
// for (var i = 1; i < 10; i += 0.1) {
//     for (var j = 1; j < 35; j += 0.1) {
//         const buyThresholdPercentage = Formatters.roundDownToOneDecimal(i);
//         const sellThresholdPercentage = Formatters.roundDownToOneDecimal(j);
//         const result = TimeTravelSurfer.surf(
//             historicalData,
//             budget,
//             buyThresholdPercentage,
//             sellThresholdPercentage
//         );
//         if (result.endingValue > bestResult) {
//             console.log(
//                 `New best time travel result = $${result.endingValue} (${result.transactionCount} transactions) (buy: ${buyThresholdPercentage}, sell: ${sellThresholdPercentage})`
//             );
//             bestResult = result.endingValue;
//         }
//     }
// }

// (async () => {
//     const productId = `${Products.Cardano}-${Products.USDollar}`;

//     const today = new Date();
//     const yesterday = new Date(today);
//     yesterday.setDate(yesterday.getDate() - 1);

//     const historicRates = await CoinbaseGateway.getHistoricRates(productId, yesterday, today) as Candle[];
    
//     for(let candle of historicRates){
//         console.log(candle.high);
//     }
// })();

// let bestResult = 0;
// for (var i = 1; i < 6; i += 0.1) {
//     for (var j = 1; j < 6; j += 0.1) {
//         const buyThresholdPercentage = i;
//         const sellThresholdPercentage = j;
//         const result = SimpleThresholdSurfer.surf(
//             data,
//             budget,
//             buyThresholdPercentage,
//             sellThresholdPercentage
//         );
//         if (result > bestResult) {
//             console.log(
//                 `New best simple threshold result = $${bestResult} (buy: ${buyThresholdPercentage.toFixed(2)}, sell: ${sellThresholdPercentage.toFixed(2)})`
//             );
//             bestResult = result;
//         }
//     }
// }
// data-bch-01 - $1263.29 (buy: 1.3, sell: 13.3)
// data-bch-02 - $1168.55 (buy: 5.7, sell: 4.6)
// data-ada-01 - $1149.74 (buy: 4.1, sell: 8.1)
// data-ada-02 - $1119.90 (buy: 1.6, sell: 4.1)
// data-ada-03

// let bestResult = 0;
// for (var i = 3; i < 6; i += 0.1) {
//     for (var j = 1; j < 3; j += 0.1) {
//         for (var k = 0; k < 20; k += 2) {
//             for (var l = 0; l < 20; l += 2) {
//                 const buyThresholdPercentage = i;
//                 const sellThresholdPercentage = j;
//                 const candleMagnitude = k;
//                 const candleThreshold = l;
//                 const result = PeakValleyTrendSurfer.surf(
//                     data,
//                     budget,
//                     buyThresholdPercentage,
//                     sellThresholdPercentage,
//                     candleMagnitude,
//                     candleThreshold
//                 );
//                 if (result > bestResult) {
//                     console.log(
//                         `New best peak valley trend result = $${result} (${buyThresholdPercentage}, ${sellThresholdPercentage}, ${candleMagnitude}, ${candleThreshold})`
//                     );
//                     bestResult = result;
//                 }
//             }
//         }
//     }
// }
// data-bch-01 - $1256.19 (12.6, 12.9, 0, 9)
// data-bch-02 - $1232.03 (1.5, 1.6, 47, 32)
// data-ada-01 - $1141.35 (6.0, 3.0, 22, 8)
// data-ada-02 - $1162.30 (3.7, 1.0, 15, 5)

let cash = 35000;
const weeks = 24;
const percentIncrease = 6;
for (var i = 1; i <= weeks; i++) {
    const margin = cash * (percentIncrease / 100);
    cash += margin;
    console.log(
        `Invested at week ${i} = $${cash.toFixed(2)} (+$${margin.toFixed(2)})`
    );
}
