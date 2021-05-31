const simpleThresholdSurfer = require("./surfers/simple-threshold");
const peakValleyTrendSurfer = require("./surfers/peak-valley-trend");
const dataProvider = require("./data/data-provider");


const budget = 1000;
const thresholdPercentage = 4;
const data = dataProvider.readFromCsvFile("data-bch.csv");
console.log(data[0]);

const simpleThresholdValue = simpleThresholdSurfer.surf(budget, thresholdPercentage, data);
console.log(`Simple threshold result = $${simpleThresholdValue}`);
const peakValleyTrendValue = peakValleyTrendSurfer.surf(budget, thresholdPercentage, data);
console.log(`Peak valley trend result = $${peakValleyTrendValue}`);
