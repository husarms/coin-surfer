import * as Winston from "winston";
import * as Formatters from "../utils/formatters";

export class Logger {
    private logger: Winston.Logger;

    private myFormat = Winston.format.printf(({ message }) => {
        return `${message}`;
    });

    constructor(logLabel: string) {
        const timestamp = Formatters.getDateyyyyMMddHHmmss();
        this.logger = Winston.createLogger({
            transports: [
                new Winston.transports.Console({ format: this.myFormat }),
                new Winston.transports.File({
                    format: this.myFormat,
                    filename: `logs/${timestamp}-${logLabel}.csv`,
                }),
            ],
        });
    }

    public log(message: string, level: string = "info") {
        this.logger.log({ level, message });
    }
}
