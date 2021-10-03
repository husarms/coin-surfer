import * as path from "path";
import * as fs from "fs";
import * as util from "util";

const fileExistsAsync = util.promisify(fs.exists);
const fileMkDirAsync = util.promisify(fs.mkdir);
const fileUnlinkAsync = util.promisify(fs.unlink);
const fileReadDirAsync = util.promisify(fs.readdir);
const fileReadAsync = util.promisify(fs.readFile);
const fileWriteAsync = util.promisify(fs.writeFile);

const inputPath = path.join(__dirname, "logs");
const outputPath = path.join(__dirname, "web/public");

const setUp = async () => {
    if (!(await fileExistsAsync(outputPath))) {
        await fileMkDirAsync(outputPath);
        console.log(`Created directory ${outputPath}`);
    } else {
        const fileNames = await fileReadDirAsync(outputPath);
        fileNames.forEach(async (fileName: string) => {
            await fileUnlinkAsync(`${outputPath}\\${fileName}`);
        });
        console.log(`Cleaned ${fileNames.length} files from ${outputPath}`);
    }
};

const parseLogs = async () => {
    const fileNames = await fileReadDirAsync(inputPath);
    let manifest = [];
    const promises = fileNames.map(async (fileName: string) => {
        if (path.extname(fileName) === ".csv") {
            const outputFileName = await convertToJsonFile(fileName);
            manifest.push(outputFileName);
        }
    });
    await Promise.all(promises);
    const fileData = JSON.stringify(manifest);
    await fileWriteAsync(`${outputPath}\\_manifest.json`, fileData);
    console.log(`Wrote ${manifest.length} entries to manifest`);
};

const convertToJsonFile = async (fileName: string): Promise<string> => {
    const data = await fileReadAsync(`${inputPath}\\${fileName}`, "utf8");
    const lines = data.split("\r\n");
    let entries = [];
    for (let line of lines) {
        if (line.length > 0) {
            const entry = parseLogEntry(line);
            entries.push(entry);
        }
    }
    const outputFileName = fileName.replace("csv", "json");
    const fileData = JSON.stringify(entries);
    await fileWriteAsync(`${outputPath}\\${outputFileName}`, fileData);
    console.log(`Wrote ${entries.length} entries to ${outputFileName}`);
    return outputFileName;
};

const parseLogEntry = (logEntryString: string): any => {
    const messageItems = JSON.stringify(logEntryString).split(",");
    const timestamp = new Date(messageItems[0]);
    const average = parseFloat(messageItems[2]);
    const price = parseFloat(messageItems[3]);
    const threshold = parseFloat(messageItems[4]);
    return { average, price, threshold, timestamp };
};

(async () => {
    console.log("Preparing to run...");
    await setUp();
    console.log("Parsing logs...");
    await parseLogs();
    console.log("Parsing complete");
})();
