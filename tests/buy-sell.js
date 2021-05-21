var fs = require("fs");

/*
    Given a feed of coin prices,
    write an algorithm to buy and sell coins at a given threshold
*/

function buySell(numberOfCoins, thresholdPercentage, prices) {
    const averagePrice = average(prices);
    const threshold = averagePrice * (thresholdPercentage / 100);
    let sellThreshold = (averagePrice + threshold).toFixed(2);
    let buyThreshold = (averagePrice - threshold).toFixed(2);
    const startPrice = prices[0];
    let lastPrice = startPrice;
    let cash = 0;
    let lookingToSell = true;

    console.log(`Average price $${averagePrice}, buy threshold $${buyThreshold}, sell threshold $${sellThreshold}`);

    console.log(
        `Starting with ${numberOfCoins} coins at a cash value of $${(
            numberOfCoins * startPrice
        ).toFixed(2)}`
    );

    for (let price of prices) {
        if (lookingToSell) {
            if (price >= sellThreshold) {
                cash = Math.floor(numberOfCoins * price);
                console.log(`Sold ${numberOfCoins} coins at $${price}, cash = $${cash}`);
                numberOfCoins = 0;
                lookingToSell = false;
            }
        } else {
            if (price <= buyThreshold) {
                numberOfCoins = Math.floor(cash / price);
                cash = cash - price * numberOfCoins;
                console.log(`Bought ${numberOfCoins} coins at $${price}`);
                lookingToSell = true;
            }
        }
        lastPrice = price;
    }
    console.log(
        `Ending with ${numberOfCoins} coins valued at $${(
            numberOfCoins * lastPrice
        ).toFixed(2)}`
    );
    console.log(`Total ending cash = $${cash.toFixed(2)}`);
}

let average = (array) => array.reduce((a, b) => a + b) / array.length;

function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

function randomBool() {
    return Math.random() > 0.5 ? true : false;
}

function generatePrices() {
    let prices = [];
    let lastPrice = 5;

    for (var i = 0; i < 1000; i++) {
        const percentageChange = randomNumber(1, 2) / 100;
        const amountChange = lastPrice * percentageChange;
        const isIncrease = randomBool();
        let price = isIncrease
            ? lastPrice + amountChange
            : lastPrice - amountChange;
        prices.push(price);
        lastPrice = price;
    }
    return prices;
}

function writeArrayToFile(array, fileName) {
    var file = fs.createWriteStream(fileName);
    array.forEach(function (v) {
        file.write(v + ",\n");
    });
    file.end();
}

function readArrayFromFile(fileName) {
    return fs.readFileSync(fileName).toString().split(",").map(Number);
}

const numberOfCoins = 200;
const thresholdPercentage = 8;

const prices = readArrayFromFile('prices-3.txt');

buySell(numberOfCoins, thresholdPercentage, prices);

//const prices = generatePrices();

// const maxPrice = Math.max.apply(null, prices);
// const minPrice = Math.min.apply(null, prices);
// console.log(`Max price = ${maxPrice}`);
// console.log(`Min price = ${minPrice}`);
