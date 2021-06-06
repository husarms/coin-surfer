import * as fs from "fs";
import * as path from "path";
import * as parse from "csv-parse/lib/sync";

export function readFromCsvFile (filePath) {
    const input = fs.readFileSync(path.resolve(__dirname, filePath)).toString();
    const records = parse(input, {
        columns: true,
        skip_empty_lines: true
    });
    return records;
}
