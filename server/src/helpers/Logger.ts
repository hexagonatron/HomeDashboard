import fs from 'fs';
import moment from 'moment';
import chalk from 'chalk';

export enum LogLevel {
    Info = 'INFO',
    Debug = 'DEBUG',
    Warn = 'WARN',
    Error = 'ERROR',
}

interface LoggerOptions {
    path?: string;
    logFileLevels?: LogLevel[]
    logConsoleLevels?: LogLevel[]
    logToFile?: boolean
}

export class Logger {
    logFileLevels: LogLevel[];
    logConsoleLevels: LogLevel[];
    logPath: string;
    logToFile: boolean;

    constructor(options: LoggerOptions = {}) {
        this.logFileLevels = options.logFileLevels || [
            LogLevel.Debug,
            LogLevel.Info,
            LogLevel.Warn,
            LogLevel.Error
        ];
        this.logConsoleLevels = options.logConsoleLevels || [
            LogLevel.Debug,
            LogLevel.Info,
            LogLevel.Warn,
            LogLevel.Error
        ];
        this.logToFile = options.logToFile || true;
        this.logPath = options.path || './log.log';
    }

    private getLogLevelText(logLevel: LogLevel) {
        switch (logLevel) {
            case LogLevel.Debug:
                return chalk.bgCyan(`[${logLevel}]`);
            case LogLevel.Info:
                return chalk.bgWhite(`[${logLevel}]`);
            case LogLevel.Warn:
                return chalk.bgYellow(`[${logLevel}]`);
            case LogLevel.Error:
                return chalk.bgRed(`[${logLevel}]`);
            default:
                return chalk.bgGreen(`[${logLevel}]`);
        }
    }

    private buildConsoleMessageString(message: string, logLevel: LogLevel) {
        return `${this.getLogLevelText(logLevel)}: ${message}`;
    }

    private buildFileMessageString(message: string, logLevel: LogLevel) {
        return `${moment().format()} [${logLevel}]: ${message}\n`;
    }

    private writeToFile(message: string) {

        if(!this.logToFile) return

        fs.appendFile(this.logPath, message, (err) => {
            if (err) throw err
        });
    }

    private logMessage(message: string, logLevel: LogLevel) {
        if (this.logConsoleLevels.includes(logLevel)) {
            console.log(this.buildConsoleMessageString(message, logLevel));
        }

        if (this.logFileLevels.includes(logLevel)) {
            this.writeToFile(this.buildFileMessageString(message, logLevel));
        }
    }

    debug(message: string) {
        this.logMessage(message, LogLevel.Debug);
    }

    info(message: string) {
        this.logMessage(message, LogLevel.Info);
    }
    
    error(message: string) {
        this.logMessage(message, LogLevel.Error);
    }
    
    warn(message: string) {
        this.logMessage(message, LogLevel.Warn);
    }
}

export default Logger;