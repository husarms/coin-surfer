const average = (array) => array.reduce((a, b) => a + b) / array.length;

exports.surf = function(numberOfCoins, thresholdPercentage, prices) {
    console.log('Peak valley trend surfer ``\'-.,_,.-\'``\'-.,_,.=\'``\'-.,_,.-\'``\'-.,_,.=\'``');
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

    let negativeDirectionalCount = 0;
    let minPrice = 0;
    let maxPrice = 0;

    for (let price of prices) {
        if (lookingToSell) {
            if (price >= sellThreshold) {
                if (price >= maxPrice) {
                    maxPrice = price;
                    negativeDirectionalCount = 0;
                } else {
                    negativeDirectionalCount++;
                }
                // Trigger sell
                if (negativeDirectionalCount > 2) {
                    cash = Math.floor(numberOfCoins * price);
                    console.log(
                        `Sold ${numberOfCoins} coins at $${price}, cash = $${cash}`
                    );
                    numberOfCoins = 0;
                    maxPrice = 0;
                    negativeDirectionalCount = 0;
                    lookingToSell = false;
                }
            }
        } else {
            if (price <= buyThreshold) {
                if (price <= minPrice) {
                    minPrice = price;
                    negativeDirectionalCount = 0;
                } else {
                    negativeDirectionalCount++;
                }
                // Trigger buy
                if (negativeDirectionalCount > 2) {
                    numberOfCoins = Math.floor(cash / price);
                    cash = cash - price * numberOfCoins;
                    console.log(`Bought ${numberOfCoins} coins at $${price}`);
                    minPrice = 0;
                    negativeDirectionalCount = 0;
                    lookingToSell = true;
                }
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
