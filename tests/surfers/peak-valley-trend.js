function getBuyThreshold(averagePrice, thresholdPercentage) {
    const threshold = averagePrice * (thresholdPercentage / 100);
    return (averagePrice - threshold).toFixed(2);
}

function getSellThreshold(averagePrice, thresholdPercentage) {
    const threshold = averagePrice * (thresholdPercentage / 100);
    return (averagePrice + threshold).toFixed(2);
}

exports.surf = function(data, budget, thresholdPercentage, candleMagnitude, candleThreshold) {
    const startPrice = data[0].price;
    let cash = budget;
    let cryptoBalance = 0;
    let lastPrice = startPrice;
    let lookingToSell = false;
    let negativeDirectionalCount = 0;
    let negativeCandleCount = 0;
    let minPrice = 0;
    let maxPrice = 0;

    for (let item of data) {
        const average = parseFloat(item.average);
        const price = parseFloat(item.price);
        const timestamp = item.timestamp;
        const sellThreshold = getSellThreshold(average, thresholdPercentage);
        const buyThreshold = getBuyThreshold(average, thresholdPercentage);
        if (lookingToSell) {
            if (price >= sellThreshold) {
                if (price >= maxPrice) {
                    maxPrice = price;
                    negativeDirectionalCount = 0;
                } else {
                    negativeDirectionalCount++;
                }
                if(negativeDirectionalCount > candleMagnitude){
                    negativeCandleCount++;
                    negativeDirectionalCount = 0;
                }
                // Trigger sell
                if (negativeCandleCount > candleThreshold) {
                    cash = cryptoBalance * price;
                    // console.log(
                    //     `Sold ${cryptoBalance} coins at $${price}, cash = $${cash} at ${timestamp}`
                    // );
                    cryptoBalance = 0;
                    maxPrice = 0;
                    negativeDirectionalCount = 0;
                    negativeCandleCount = 0;
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
                if(negativeDirectionalCount > candleMagnitude){
                    negativeCandleCount++;
                    negativeDirectionalCount = 0;
                }
                // Trigger buy
                if (negativeCandleCount > candleThreshold) {
                    cryptoBalance = cash / price;
                    cash = cash - price * cryptoBalance;
                    // console.log(`Bought ${cryptoBalance} coins at $${price} at ${timestamp}`);
                    minPrice = 0;
                    negativeDirectionalCount = 0;
                    negativeCandleCount = 0;
                    lookingToSell = true;
                }
            }
        }
        lastPrice = price;
    }
    let endingValue = 0;
    if(cryptoBalance > 0){
        endingValue = (cryptoBalance * lastPrice).toFixed(2);
        //console.log(`Ending with $${endingValue} (${cryptoBalance} coins)`);
    } else {
        endingValue = cash.toFixed(2);
        //console.log(`Ending with $${endingValue} cash`);
    }
    return endingValue;
};
