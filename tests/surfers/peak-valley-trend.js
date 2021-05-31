function getBuyThreshold(averagePrice, thresholdPercentage) {
    const threshold = averagePrice * (thresholdPercentage / 100);
    return (averagePrice - threshold).toFixed(2);
}

function getSellThreshold(averagePrice, thresholdPercentage) {
    const threshold = averagePrice * (thresholdPercentage / 100);
    return (averagePrice + threshold).toFixed(2);
}

exports.surf = function(budget, thresholdPercentage, data) {
    // console.log('Peak valley trend surfer ``\'-.,_,.-\'``\'-.,_,.=\'``\'-.,_,.-\'``\'-.,_,.=\'``');
    
    const startPrice = data[0].price;
    let cash = budget;
    let cryptoBalance = 0;
    let lastPrice = startPrice;
    let lookingToSell = false;
    let negativeDirectionalCount = 0;
    let minPrice = 0;
    let maxPrice = 0;

    for (let item of data) {
        const average = parseFloat(item.average);
        const price = parseFloat(item.price);
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
                // Trigger sell
                if (negativeDirectionalCount > 10) {
                    cash = cryptoBalance * price;
                    // console.log(
                    //     `Sold ${cryptoBalance} coins at $${price}, cash = $${cash}`
                    // );
                    cryptoBalance = 0;
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
                if (negativeDirectionalCount > 10) {
                    cryptoBalance = cash / price;
                    cash = cash - price * cryptoBalance;
                    //console.log(`Bought ${cryptoBalance} coins at $${price}`);
                    minPrice = 0;
                    negativeDirectionalCount = 0;
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
