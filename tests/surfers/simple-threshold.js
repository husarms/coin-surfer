const average = (array) => array.reduce((a, b) => a + b) / array.length;

exports.surf = function(numberOfCoins, thresholdPercentage, prices) {
    console.log('Simple threshold surfer ``\'-.,_,.-\'``\'-.,_,.=\'``\'-.,_,.-\'``\'-.,_,.=\'``');
    const averagePrice = average(prices);
    const threshold = averagePrice * (thresholdPercentage / 100);
    let sellThreshold = (averagePrice + threshold).toFixed(2);
    let buyThreshold = (averagePrice - threshold).toFixed(2);
    const startPrice = prices[0];
    let lastPrice = startPrice;
    let cash = 0;
    let lookingToSell = true;

    console.log(
        `Average price $${averagePrice}, buy threshold $${buyThreshold}, sell threshold $${sellThreshold}`
    );

    console.log(
        `Starting with ${numberOfCoins} coins at a cash value of $${(
            numberOfCoins * startPrice
        ).toFixed(2)}`
    );

    for (let price of prices) {
        if (lookingToSell) {
            if (price >= sellThreshold) {
                cash = Math.floor(numberOfCoins * price);
                console.log(
                    `Sold ${numberOfCoins} coins at $${price}, cash = $${cash}`
                );
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
};