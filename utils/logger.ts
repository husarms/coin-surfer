import * as Winston from "winston";
import * as Formatters from "../utils/formatters";

export class Logger {
    private logger: Winston.Logger;
    private jsonLogger: Winston.Logger;

    private myFormat = Winston.format.printf(({ message }) => {
        return `${message}`;
    });
    private fileNames: string[] = [];

    constructor(logLabel: string) {
        const timestamp = Formatters.getDateyyyyMMddHHmmss();
        const csvFileName = `logs/${timestamp}-${logLabel}.csv`;
        const jsonFileName = `logs/json/${timestamp}-${logLabel}.json`
        this.logger = Winston.createLogger({
            transports: [
                new Winston.transports.Console({ format: this.myFormat }),
                new Winston.transports.File({
                    format: this.myFormat,
                    filename: csvFileName,
                }),
            ],
        });
        this.jsonLogger = Winston.createLogger({
            transports: [
                new Winston.transports.File({
                    format: this.myFormat,
                    filename: jsonFileName,
                }),
            ],
        });
        this.fileNames.push(csvFileName);
    }

    public getFileNames(): string[] {
        return this.fileNames;
    }

    public log(message: string, level: string = "info") {
        this.logger.log({ level, message });
    }
}
