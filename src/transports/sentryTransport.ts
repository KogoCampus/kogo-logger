import * as Sentry from '@sentry/node';
import { LogTransport, LogTransportParams } from '../types';

const sentryTransport = (): LogTransport => (params: LogTransportParams) => {
    if (!params) return;
    const date = params.date.toLocaleTimeString('en-US', { hour12: true });
    const level = params.level;
    const message = params.message;
    const context = params.context;
    const formattedMessage = context ? `${date} | ${context} | ${level.toUpperCase()} : ${message}` : `${date} | ${level.toUpperCase()} : ${message}`;
    
    const sentryEndpoint =params.options?.sentryEndpoint;

    Sentry.init({
        dsn: sentryEndpoint,
    });
    Sentry.captureException(formattedMessage);
    // Sentry.captureMessage(formattedMessage);
};

export default sentryTransport;