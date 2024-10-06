export type Level = 'debug' | 'info' | 'warn' | 'error' | string;

export type LevelValue = 0 | 1 | 2 | 3 | number;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Message = any;

// log levels configuration
export interface LogLevelConfig {
    [key: string]: number;
}

// log transport options
export interface LogTransportOptions {
    message: string;
    date: Date;
    level: Level;
    context?: string | null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    options?: any;
}

export type LogTransport = (options: LogTransportOptions) => void;

export interface LoggerConfig {
    levels?: { [levelName: Level]: LevelValue; };
    severity?: Level;
    transport?: LogTransport | LogTransport[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    transportOptions?: any;
    async?: boolean;
    asyncFunc?: Function;
    enabledContexts?: string[] | null;
}
