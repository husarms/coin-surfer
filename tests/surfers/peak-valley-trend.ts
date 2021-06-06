import { getBuyThreshold, getSellThreshold } from "./shared/functions";
import { Data } from "../interfaces/data";
import * as Formatters from "../../utils/formatters";

export function surf(data: Data[], budget: number, buyThresholdPercentage: number, sellThresholdPercentage: number, candleMagnitude: number, candleThreshold: number) {
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
        const average = item.average;
        const price = item.price;
        const sellThreshold = getSellThreshold(average, sellThresholdPercentage);
        const buyThreshold = getBuyThreshold(average, buyThresholdPercentage);
        if (lookingToSell) {
            if (price >= sellThreshold) {
                if (price >= maxPrice) {
                    maxPrice = price;
                    negativeDirectionalCount = 0;
                } else {
                    negativeDirectionalCount++;
                }
                if(negativeDirectionalCount >= candleMagnitude){
                    negativeCandleCount++;
                    negativeDirectionalCount = 0;
                }
                // Trigger sell
                if (negativeCandleCount >= candleThreshold) {
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
                if(negativeDirectionalCount >= candleMagnitude){
                    negativeCandleCount++;
                    negativeDirectionalCount = 0;
                }
                // Trigger buy
                if (negativeCandleCount >= candleThreshold) {
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
        endingValue = Formatters.roundDownToTwoDecimals(cryptoBalance * lastPrice);
        //console.log(`Ending with $${endingValue} (${cryptoBalance} coins)`);
    } else {
        endingValue = Formatters.roundDownToTwoDecimals(cash);
        //console.log(`Ending with $${endingValue} cash`);
    }
    return endingValue;
};
