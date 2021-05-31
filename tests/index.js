const simpleThresholdSurfer = require("./surfers/simple-threshold");
const peakValleyTrendSurfer = require("./surfers/peak-valley-trend");
const dataProvider = require("./data/data-provider");

const budget = 1000;
const data = dataProvider.readFromCsvFile("data-bch.csv");

// let bestResult = 0;
// let bestPercentage = 0;
// for(var i = 1; i < 6; i+=0.1){
//     const thresholdPercentage = i;
//     const result = parseFloat(simpleThresholdSurfer.surf(data, budget, thresholdPercentage));
//     if(result > bestResult){
//         bestResult = result;
//         bestPercentage = thresholdPercentage;
//         console.log(`New best simple threshold result = $${bestResult} (${bestPercentage})`);
//     }
// }
// $1115.70 (4.6)

const simpleThresholdValue = simpleThresholdSurfer.surf(data, budget, 4.6);
console.log(`Simple threshold result = $${simpleThresholdValue}`);

// let bestResult = 0;
// let bestThresholdPercentage = 0;
// let bestCandleMagnitude = 0;
// let bestCandleThreshold = 0;
// for(var i = 2; i < 6; i++){
//     for(var j = 10; j < 120; j++){
//         for(var k = 10; k < 120; k++){
//             const thresholdPercentage = i;
//             const candleMagnitude = j;
//             const candleThreshold = k;
//             const result = parseFloat(peakValleyTrendSurfer.surf(data, budget, thresholdPercentage, candleMagnitude, candleThreshold));
//             if(result > bestResult){
//                 console.log(`New best peak valley trend result = $${result} (${thresholdPercentage}, ${candleMagnitude}, ${candleThreshold})`);
//                 bestResult = result;
//                 bestThresholdPercentage = thresholdPercentage;
//                 bestCandleMagnitude = candleMagnitude;
//                 bestCandleThreshold = candleThreshold;
//             }
//         }
//     }
// }
// $1193.02 (2, 47, 27)
// $1214.60 (2, 98, 14)

const peakValleyTrendValue = peakValleyTrendSurfer.surf(data, budget, 2, 98, 14);
console.log(`Peak valley trend result = $${peakValleyTrendValue}`);
