import { Level, LoggerConfig, Message } from './types';
import consoleTransport from './transports/consoleTransport';

const asyncFunc = (cb: Function) => setTimeout(cb, 0);

const defaultConfig: LoggerConfig = {
    levels: {
        debug: 0,
        info: 1,
        warn: 2,
        error: 3,
    },
    severity: 'debug',
    async: false,
    asyncFunc,
    transport: consoleTransport(),
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const stringifyFunc = (msg: Message): string => {
    if (typeof msg === 'string') return msg;
    if (typeof msg === 'function') return `[function ${msg.name}]`;
    if (msg?.stack && msg?.message) return msg.message;
    try {
        return JSON.stringify(msg, null, 1);
    } catch {
        return 'Undefined Message';
    }
};

export class Logger {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;

    private config: LoggerConfig;

    private context: string | null;

    constructor(config: LoggerConfig = defaultConfig, context: string | null = null) {
        this.config = {
            ...defaultConfig,
            ...config,
        };
        this.context = context;
        this.setupLogMethods();
    }

    private setupLogMethods() {
        Object.keys(this.config.levels).forEach(level => {
            this[level] = this.log.bind(this, level);
        });
    }

    private log(level: Level, ...messages: Message[]) {
        if (this.config.levels[level] < this.config.levels[this.config.severity]) 
            return;

        const date = new Date();
        const formattedMessage = messages.map(stringifyFunc).join(' ');
        const message = formattedMessage;
        const options = this.config.transportOptions;

        if (typeof this.config.transport === 'function') {
            this.config.transport({ level, message, date, options, context: this.context });
        } else if (Array.isArray(this.config.transport)) {
            this.config.transport.forEach(t => t({ level, message, date, options, context: this.context }));
        }
    }

    public ns(context: string): Logger {
        if (!context) {
            throw new Error('Context is required.');
        }

        if (!this.config.enabledContexts || !this.config.enabledContexts.includes(context)) {
            throw new Error(`Context ${context} is not allowed to be rooted from this logger.`);
        }

        return new Logger(this.config, context);
    }
}

export const createLogger = (config?: LoggerConfig): Logger => config ? new Logger(config) : new Logger();

export type * from './types';

export * from './transports';

