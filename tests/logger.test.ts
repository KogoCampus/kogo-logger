import { createLogger } from '../src/index';
import consoleTransport from '../src/transports/consoleTransport';
import { LoggerConfig } from '../src/types';

describe('Logger', () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('should log messages based on severity level', () => {
    const config: LoggerConfig = {
      severity: 'info',
      transport: consoleTransport(),
    };

    const logger = createLogger(config);

    logger.debug('This is a debug message');
    expect(consoleSpy).not.toHaveBeenCalled();

    logger.info('This is an info message');
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('This is an info message'));

    logger.warn('This is a warning message');
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('This is a warning message'));

    logger.error('This is an error message');
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('This is an error message'));
  });

  it('should support custom contexts', () => {
    const config: LoggerConfig = {
      severity: 'debug',
      transport: consoleTransport(),
      enabledContexts: ['testContext'],
    };

    const logger = createLogger(config).ns('testContext');

    logger.debug('Debugging with context');
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('testContext'));
  });

  it('should throw an error for invalid context', () => {
    const config: LoggerConfig = {
      severity: 'debug',
      transport: consoleTransport(),
      enabledContexts: ['testContext'],
    };

    const logger = createLogger(config);

    expect(() => {
      logger.ns('invalidContext');
    }).toThrow('Context invalidContext is not allowed to be rooted from this logger.');
  });
});