import * as Winston from "winston";
import * as Formatters from "../utils/formatters";

export class Logger {
    private consoleLogger: Winston.Logger;
    private csvLogger: Winston.Logger;
    private fileNames: string[] = [];
    private myFormat = Winston.format.printf(({ message }) => {
        return `${message}`;
    });
    constructor(logLabel: string) {
        const timestamp = Formatters.getDateyyyyMMddHHmmss();
        const csvConsoleFileName = `logs/${timestamp}-${logLabel}-console.csv`;
        const csvDataFileName = `logs/${timestamp}-${logLabel}-data.csv`;
        this.consoleLogger = Winston.createLogger({
            transports: [
                new Winston.transports.Console({ format: this.myFormat }),
                new Winston.transports.File({
                    format: this.myFormat,
                    filename: csvConsoleFileName,
                }),
            ],
        });
        this.csvLogger = Winston.createLogger({
            transports: [
                new Winston.transports.File({
                    format: this.myFormat,
                    filename: csvDataFileName,
                }),
            ],
        });
        this.fileNames.push(csvConsoleFileName);
        this.fileNames.push(csvDataFileName);
    }
    public getFileNames(): string[] {
        return this.fileNames;
    }
    public logToConsole(message: string, level: string = "info") {
        this.consoleLogger.log({ level, message });
    }
    public logToCsvFile(message: string, level: string = "info") {
        this.csvLogger.log({ level, message });
    }
}
