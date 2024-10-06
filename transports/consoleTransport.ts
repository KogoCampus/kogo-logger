import { LogTransport, LogTransportOptions } from '../loggerTypes';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const availableColors: any = {
    default: null,
    black: 30,
    red: 31,
    green: 32,
    yellow: 33,
    blue: 34,
    magenta: 35,
    cyan: 36,
    white: 37,
    grey: 90,
    redBright: 91,
    greenBright: 92,
    yellowBright: 93,
    blueBright: 94,
    magentaBright: 95,
    cyanBright: 96,
    whiteBright: 97,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const availableBgColors: any = {
    black: 40,
    red: 41,
    green: 42,
    yellow: 43,
    blue: 44,
    magenta: 45,
    cyan: 46,
    white: 47,
    grey: 100,
    redBright: 101,
    greenBright: 102,
    yellowBright: 103,
    blueBright: 104,
    magentaBright: 105,
    cyanBright: 106,
    whiteBright: 107,
};

const resetColors = `\x1b[0m`;

const consoleTransport: LogTransport = (props: LogTransportOptions) => {
    if (!props) return;
    let msg = props.message;
    let color = null;
    const date = props.date.toLocaleTimeString('en-US', { hour12: true });

    // set format with color if available
    const levelColor = availableColors[props.options?.colors?.[props.level]];
    if (levelColor) {
        color = `\x1b[${levelColor}m`;
        msg = `${color}${date} | ${props.level.toUpperCase()} : ${msg}${resetColors}`;
    } else {
        msg = `${date} | ${props.level.toUpperCase()} : ${msg}`;
    }

    let ctxColor;
    let ctxMsg;
    // context(namespace) exists
    if (props.context) {
        const bgColor = availableBgColors[props.options?.contextColors?.[props.context]];
        if (bgColor) {
            ctxColor = `\x1b[${bgColor}m`;
            const whiteTextColor = `\x1b[37m`;
            ctxMsg = `${ctxColor}${whiteTextColor} ${props.context} ${resetColors}`;
        } else {
            ctxMsg = `${props.context}`;
        }
    }

    if (ctxMsg) {
        if (color) {
            msg = `${color}${date} |${resetColors} ${ctxMsg} ${color}| ${props.level.toUpperCase()} : ${
                props.message
            }${resetColors}`;
        } else {
            msg = `${date} | ${ctxMsg} | ${props.level.toUpperCase()} : ${props.message}`;
        }
    } else if (color) {
        msg = `${color}${date} |${resetColors} ${color}${props.level.toUpperCase()} : ${props.message}${resetColors}`;
    } else {
        msg = `${date} | ${props.level.toUpperCase()} : ${props.message}`;
    }
    // eslint-disable-next-line no-console
    console.log(msg.trim());
};

export default consoleTransport;
