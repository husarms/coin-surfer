function getBuyThreshold(averagePrice, thresholdPercentage) {
    const threshold = averagePrice * (thresholdPercentage / 100);
    return (averagePrice - threshold).toFixed(2);
}

function getSellThreshold(averagePrice, thresholdPercentage) {
    const threshold = averagePrice * (thresholdPercentage / 100);
    return (averagePrice + threshold).toFixed(2);
}

exports.surf = function(budget, thresholdPercentage, data) {
    // console.log('Simple threshold surfer ``\'-.,_,.-\'``\'-.,_,.=\'``\'-.,_,.-\'``\'-.,_,.=\'``');

    const startPrice = data[0].price;
    let cash = budget;
    let cryptoBalance = 0;
    let lastPrice = startPrice;
    let lookingToSell = false;

    for (let item of data) {
        const average = parseFloat(item.average);
        const price = parseFloat(item.price);
        const sellThreshold = getSellThreshold(average, thresholdPercentage);
        const buyThreshold = getBuyThreshold(average, thresholdPercentage);

        if (lookingToSell) {
            if (price >= sellThreshold) {
                cash = cryptoBalance * price;
                // console.log(
                //     `Sold ${cryptoBalance} coins at $${price}, cash = $${cash}`
                // );
                cryptoBalance = 0;
                lookingToSell = false;
            }
        } else {
            if (price <= buyThreshold) {
                cryptoBalance = cash / price;
                cash = cash - price * cryptoBalance;
                //console.log(`Bought ${cryptoBalance} coins at $${price}`);
                lookingToSell = true;
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