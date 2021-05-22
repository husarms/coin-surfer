var fs = require("fs");
var path = require("path");

exports.arrayAverage = (array) => array.reduce((a, b) => a + b) / array.length;

exports.randomNumber = function (min, max) {
    return Math.random() * (max - min) + min;
};

exports.randomBool = function () {
    return Math.random() > 0.5 ? true : false;
};

exports.generatePrices = function () {
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
};

exports.writeArrayToFile = function (array, filePath) {
    var file = fs.createWriteStream(path.resolve(__dirname, filePath));
    array.forEach(function (v) {
        file.write(v + ",\n");
    });
    file.end();
};

exports.readArrayFromFile = function (filePath) {
    return fs.readFileSync(path.resolve(__dirname, filePath)).toString().split(",").map(Number);
};
