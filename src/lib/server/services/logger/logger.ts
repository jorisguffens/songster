import log4js from "log4js";

export class LoggerService {

    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
    public static configure(level: "trace" | "debug" | "info" | "warn" | "error" | "fatal" | string = "info") {
        log4js.configure({
            appenders: {
                console: { type: "console" },
            },
            categories: {
                default: { appenders: ["console"], level },
            },
        });
    }
}

export class Logger {

    private constructor(
        private readonly logger: log4js.Logger
    ) {
    }

    public static create(name: string = "default") {
        return new Logger(log4js.getLogger(name));
    }

    public trace(message,...args) {
        this.logger.trace(message, ...args);
    }

    public debug(message,...args) {
        this.logger.debug(message, ...args);
    }

    public info(message,...args) {
        this.logger.info(message, ...args);
    }

    public warn(message,...args) {
        this.logger.warn(message, ...args);
    }

    public error(message,...args) {
        this.logger.error(message, ...args);
    }

    public fatal(message,...args) {
        this.logger.fatal(message, ...args);
    }

}