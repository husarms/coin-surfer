const fs = require("fs");
import { Actions } from "../utils/enums";
import SurfParameters from "../interfaces/surf-parameters";
import SurfState from "../interfaces/surf-state";
import Fill from "../interfaces/fill";

function getFilePath(cryptoCurrency: string): string {
    const directory = "state";
    const fileName = `${cryptoCurrency}-state.json`;
    const filePath = `${directory}/${fileName}`;
    return filePath;
}

export function defineState(
    action: Actions.Buy | Actions.Sell,
    parameters: SurfParameters,
    cryptoBalance: number,
    fiatBalance: number,
    buyThreshold: number,
    sellThreshold: number,
    lastBuyFill: Fill,
    lastSellFill: Fill
): SurfState {
    const state: SurfState = {
        action,
        parameters,
        cryptoBalance,
        fiatBalance,
        buyThreshold,
        sellThreshold,
        lastBuyFill,
        lastSellFill,
        lastUpdateTimestamp: new Date(),
    };
    return state;
}

export function saveState(state: SurfState): SurfState {
    const filePath = getFilePath(state.parameters.cryptoCurrency);
    state.lastUpdateTimestamp = new Date();
    fs.writeFile(filePath, JSON.stringify(state), (err) => {
        if (err) throw err;
    });
    return state;
}

export function getState(cryptoCurrency: string): SurfState {
    const filePath = getFilePath(cryptoCurrency);
    const fileContent = fs.readFile(filePath);
    return JSON.parse(fileContent);
}
