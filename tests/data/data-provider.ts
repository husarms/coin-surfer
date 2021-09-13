import * as fs from "fs";
import * as path from "path";
import * as parse from "csv-parse/lib/sync";
import { Data } from "../interfaces/data";
import { HistoricalData } from "../interfaces/historical-data";

export function readFromCsvFile (filePath) : Data[] {
    const input = fs.readFileSync(path.resolve(__dirname, filePath)).toString();
    const records = parse(input, {
        columns: true,
        skip_empty_lines: true
    }) as Data[];
    return records;
}

export function writeToJsonFile (filePath, data: Data[], callback) {
    const formattedData = data.map(d => ({ timestamp: d.timestamp, average: d.average, price: d.price}));
    const stringData = JSON.stringify(formattedData, null, 4);
    fs.writeFile(path.resolve(__dirname, filePath), stringData, callback);
}

export function readFromJsonFile (filePath) : HistoricalData[] {
    const input = fs.readFileSync(path.resolve(__dirname, filePath)).toString();
    return JSON.parse(input) as HistoricalData[];
}
