const simpleThresholdSurfer = require("./surfers/simple-threshold");
const peakValleyTrendSurfer = require("./surfers/peak-valley-trend");
const dataProvider = require("./data/data-provider");


const numberOfCoins = 200;
const thresholdPercentage = 8;
const prices = dataProvider.readArrayFromFile("prices-3.txt");

simpleThresholdSurfer.surf(numberOfCoins, thresholdPercentage, prices);
peakValleyTrendSurfer.surf(numberOfCoins, thresholdPercentage, prices);
