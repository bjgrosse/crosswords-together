import winston, { createLogger, format, transports, } from 'winston';
import * as StackTrace from 'stacktrace-js';
import firebase from 'firebase'

const { combine, timestamp, prettyPrint, colorize, errors, json, simple } = format;

const enumerateErrorFormat = format(info => {
    if (info.message instanceof Error) {
        info.message = Object.assign({
            message: info.message.message,
            stack: info.message.stack
        }, info.message);
    }

    if (info instanceof Error) {
        return Object.assign({
            message: info.message,
            stack: info.stack
        }, info);
    }

    return info;
});

const showNewLines = format.printf((info) => {
    return JSON.stringify(info, null, 3).replace(/\\n/g, '\n')
})

function intialize() {
    let logger = createLogger({
        format: combine(
            enumerateErrorFormat(),
            timestamp(),
            json()
        ),

    })

    //
    // If we're not in production then log to the `console` with the format:
    // `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
    // 
    if (process.env.NODE_ENV !== 'production') {
        logger.add(new transports.Console({
            format: showNewLines
        }));
    }

    // Override the error() method of our logger
    // and add our own logic to map the stack trace.
    logger.errorInternal = logger.error
    logger.error = function (...args) {

        let err;
        let errIdx;

        // Check the args for an error object
        for (let i = 0; i <= args.length; i++) {
            if (args[i] instanceof Error) {
                err = args[i]
                errIdx = i
                break
            }
        }

        if (!err) {
            logger.errorInternal(...args)
            return
        }

        try {
            //
            // Get the updated call stack
            StackTrace.fromError(err)
                .then((frames) => {
                    // update the args 
                    args[errIdx] = {...err, stack: frames.map(x => x.toString()).join("\n    ")}
                }).catch((newErr) => {
                    logger.errorInternal("error translating stack trace: ", newErr)
                }).finally(()=> {  
                    logger.errorInternal(...args)
                })

        } catch (error) {
            logger.errorInternal("error translating stack trace: ", error)
            logger.errorInternal(...args)
        }
    }

    return logger
}

export const logger = intialize();

export default logger;
