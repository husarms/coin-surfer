const simpleThresholdSurfer = require("./surfers/simple-threshold");
const peakValleyTrendSurfer = require("./surfers/peak-valley-trend");
const dataProvider = require("./data/data-provider");

const budget = 1000;
const data = dataProvider.readFromCsvFile("data-ada-02.csv");

// let bestResult = 0;
// for (var i = 1; i < 6; i += 0.1) {
//     for (var j = 1; j < 6; j += 0.1) {
//         const buyThresholdPercentage = i.toFixed(1);
//         const sellThresholdPercentage = j.toFixed(1);
//         const result = parseFloat(
//             simpleThresholdSurfer.surf(
//                 data,
//                 budget,
//                 buyThresholdPercentage,
//                 sellThresholdPercentage
//             )
//         );
//         if (result > bestResult) {
//             console.log(
//                 `New best simple threshold result = $${bestResult} (buy: ${buyThresholdPercentage}, sell: ${sellThresholdPercentage})`
//             );
//             bestResult = result;
//         }
//     }
// }
// data-bch-01 - $1263.29 (buy: 1.3, sell: 13.3)
// data-bch-02 - $1168.55 (buy: 5.7, sell: 4.6)
// data-ada-01 - $1149.74 (buy: 4.1, sell: 8.1)
// data-ada-02 - $1119.90 (buy: 1.6, sell: 4.1)

// const simpleThresholdValue = simpleThresholdSurfer.surf(data, budget, 5);
// console.log(`Simple threshold result = $${simpleThresholdValue}`);

let bestResult = 0;
for(var i = 3; i < 6; i+= 0.1){
    for(var j = 1; j < 3; j+= 0.1){
        for(var k = 0; k < 20; k+= 2){
            for(var l = 0; l < 20; l+= 2){
                const buyThresholdPercentage = i.toFixed(1);
                const sellThresholdPercentage = j.toFixed(1);
                const candleMagnitude = k;
                const candleThreshold = l;
                const result = parseFloat(peakValleyTrendSurfer.surf(data, budget, buyThresholdPercentage, sellThresholdPercentage, candleMagnitude, candleThreshold));
                if(result > bestResult){
                    console.log(`New best peak valley trend result = $${result} (${buyThresholdPercentage}, ${sellThresholdPercentage}, ${candleMagnitude}, ${candleThreshold})`);
                    bestResult = result;
                }
            }
        }
    }
}
// data-bch-01 - $1256.19 (12.6, 12.9, 0, 9)
// data-bch-02 - $1232.03 (1.5, 1.6, 47, 32)
// data-ada-01 - $1141.35 (6.0, 3.0, 22, 8)
// data-ada-02 - $1162.30 (3.7, 1.0, 15, 5)

// const peakValleyTrendValue = peakValleyTrendSurfer.surf(data, budget, 2, 75, 20);
// console.log(`Peak valley trend result = $${peakValleyTrendValue}`);
