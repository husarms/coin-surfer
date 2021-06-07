import { getBuyThreshold, getSellThreshold } from "./shared/functions";
import { HistoricalData } from "../interfaces/historical-data";
import * as Formatters from "../../utils/formatters";

export function surf(data: HistoricalData[], budget: number, buyThresholdPercentage: number, sellThresholdPercentage: number) {
    const startPrice = data[0].low;
    let cash = budget;
    let cryptoBalance = 0;
    let transactionCount = 0;
    let lastPrice = startPrice;
    let lookingToSell = false;

    for (var i = 1; i < data.length; i++) {
        const item = data[i];
        const timestamp = item.date.toLocaleString();
        const average =  data[i - 1].vwap; // average from yesterday
        const sellThreshold = getSellThreshold(average, sellThresholdPercentage);
        const buyThreshold = getBuyThreshold(average, buyThresholdPercentage);

        //console.log(`Average: ${average}, Price: ${price}, Sell Threshold: ${sellThreshold}, Buy Threshold: ${buyThreshold}`);

        if (lookingToSell) {
            if (item.high >= sellThreshold) {
                //console.log(`Sell threshold hit (${price} >= ${sellThreshold})`);
                cash = cryptoBalance * sellThreshold;
                //console.log(`Sold ${cryptoBalance.toFixed(4)} coins at $${sellThreshold.toFixed(2)}, cash = $${cash.toFixed(2)} at ${timestamp}`);
                cryptoBalance = 0;
                lookingToSell = false;
                transactionCount++;
                lastPrice = sellThreshold;
            }
        } else {
            if (item.low <= buyThreshold) {
                //console.log(`Buy threshold hit (${price} <= ${buyThreshold})`);
                cryptoBalance = cash / buyThreshold;
                cash = cash - (buyThreshold * cryptoBalance);
                //console.log(`Bought ${cryptoBalance.toFixed(4)} coins at $${buyThreshold.toFixed(2)} at ${timestamp}`);
                lookingToSell = true;
                transactionCount++;
                lastPrice = buyThreshold;
            }
        }
    }

    let endingValue = 0;
    if(cryptoBalance > 0){
        endingValue = Formatters.roundDownToTwoDecimals(cryptoBalance * lastPrice);
        //console.log(`Ending with $${endingValue} (${cryptoBalance} coins)`);
    } else {
        endingValue = Formatters.roundDownToTwoDecimals(cash);
        //console.log(`Ending with $${endingValue} cash`);
    }
    return { endingValue, transactionCount };
};