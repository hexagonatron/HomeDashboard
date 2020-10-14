import Logger, { LogLevel } from '../helpers/Logger';
import path from 'path';

describe('Testing the Logger class', () => {

    const log = new Logger({
        logToFile: false,
        path: path.join(__dirname, 'log/test-logs.log'),
        logConsoleLevels: [
            LogLevel.Debug,
            LogLevel.Info,
            LogLevel.Warn,
            LogLevel.Error,
        ],
        logFileLevels: [
            LogLevel.Debug,
            LogLevel.Info,
            LogLevel.Warn,
            LogLevel.Error,
        ]
    });


    it('Should print all messages', () => {
        const consoleMock = jest.spyOn(console, "log")
        consoleMock.mockImplementation(() => { });

        log.debug("This is a debug message");
        log.error("This is an error message");
        log.info("This is an Info message");
        log.warn("This is a warning message");

        expect(consoleMock).toHaveBeenCalledTimes(4);
        consoleMock.mockRestore();
    });

})