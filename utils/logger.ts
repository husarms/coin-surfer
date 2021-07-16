import * as Winston from "winston";
import * as Formatters from "../utils/formatters";
import * as WebSocket from "ws";

export class Logger {
    private logger: Winston.Logger;
    private ws: WebSocket;

    private myFormat = Winston.format.printf(({ message }) => {
        return `${message}`;
    });

    constructor(logLabel: string) {
        // this.ws = new WebSocket("ws://localhost:8080/");
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
        this.logger.log({
            level,
            message,
        });
        //this.ws.send(message);
    }
}
