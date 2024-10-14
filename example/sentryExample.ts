import { createLogger } from '../src/index';
const consoleTransport = require('../src/transports/consoleTransport').default;
const sentryTransport = require('../src/transports/sentryTransport').default;
import { LoggerConfig } from '../src/types';

// Example usage
const config = {
    severity: 'info',
    transport: sentryTransport(),
    transportOptions:{
        colors: {
            debug: 'blue',
            info: 'green',
            warn: 'yellow',
            error: 'red',
        },
        contextColors:{
            signin: 'red',
        },
        sentryEndpoint: "https://4181c78bea1cc3051057d4d789df6544@o4508081755193344.ingest.us.sentry.io/4508123069153280"
    },
    enabledContexts: ['signin'],
};

// Create Logger Instance
const logger = createLogger(config);
const signinLogger = logger.ns('signin');

// Log messages
signinLogger.debug('This is a debug message');
// logger.info('This is an info message');
// logger.error('This is an error message');

// try {
//     throw new Error("test error")
// }
//    catch(e) {
//    logger.error(e)
// }