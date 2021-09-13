import { getBuyThreshold, getSellThreshold } from "./shared/functions";
import { Data } from "../../web/src/interfaces/data";
import * as Formatters from "../../utils/formatters";

export function surf(data: Data[], budget: number, buyThresholdPercentage: number, sellThresholdPercentage: number) {
    const startPrice = data[0].price;
    let cash = budget;
    let cryptoBalance = 0;
    let lastPrice = startPrice;
    let lookingToSell = false;

    for (let item of data) {
        const { timestamp, average, price } = item;
        const sellThreshold = getSellThreshold(average, sellThresholdPercentage);
        const buyThreshold = getBuyThreshold(average, buyThresholdPercentage);

        if (lookingToSell) {
            if (price >= sellThreshold) {
                cash = cryptoBalance * price;
                // console.log(
                //     `Sold ${cryptoBalance} coins at $${price}, cash = $${cash} at ${timestamp}`
                // );
                cryptoBalance = 0;
                lookingToSell = false;
            }
        } else {
            if (price <= buyThreshold) {
                cryptoBalance = cash / price;
                cash = cash - price * cryptoBalance;
                // console.log(`Bought ${cryptoBalance} coins at $${price} at ${timestamp}`);
                lookingToSell = true;
            }
        }
        lastPrice = price;
    }

    let endingValue = 0;
    if(cryptoBalance > 0){
        endingValue = Formatters.roundDownToTwoDecimals(cryptoBalance * lastPrice);
        //console.log(`Ending with $${endingValue} (${cryptoBalance} coins)`);
    } else {
        endingValue = Formatters.roundDownToTwoDecimals(cash);
        //console.log(`Ending with $${endingValue} cash`);
    }
    return endingValue;
};