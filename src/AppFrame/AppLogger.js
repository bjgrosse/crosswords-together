import { format, transports } from "winston";
import * as StackTrace from "stacktrace-js";
import { createThrottledLogger } from "../Logging/ThrottledLogger";

import FirebaseTransport from "../Logging/FirebaseTransport";

const { combine, timestamp, json } = format;

const cloneError = function(error, props) {
  return Object.assign(
    {
      message: error.message,
      stack: error.stack
    },
    error,
    props
  );
};

const enumerateErrorFormat = format(info => {
  if (info.message instanceof Error) {
    info.message = cloneError(info.message);
  }

  if (info instanceof Error) {
    return cloneError(info);
  }

  return info;
});

const showNewLines = format.printf(info => {
  return JSON.stringify(info, null, 3).replace(/\\n/g, "\n");
});

function intialize() {
  let logger = createThrottledLogger({
    format: combine(enumerateErrorFormat(), timestamp(), json(), showNewLines),
    transports: [new FirebaseTransport({ level: "error" })]
  });

  if (process.env.NODE_ENV !== "production") {
    logger.add(
      new transports.Console({
        format: showNewLines
      })
    );

    // Override the error() method of our logger
    // and add our own logic to map the stack trace.
    logger.errorInternal = logger.error;
    logger.error = function(...args) {
      let err;
      let errIdx;

      // Check the args for an error object
      for (let i = 0; i <= args.length; i++) {
        if (args[i] instanceof Error) {
          err = args[i];
          errIdx = i;
          break;
        }
      }

      if (!err) {
        logger.errorInternal(...args);
        return;
      }

      try {
        //
        // Get the updated call stack
        StackTrace.fromError(err)
          .then(frames => {
            // update the args
            let newError = cloneError(err, {
              stack: frames.map(x => x.toString()).join("\n    ")
            });
            args[errIdx] = newError;
          })
          .catch(newErr => {
            logger.errorInternal("error translating stack trace: ", newErr);
          })
          .finally(() => {
            logger.errorInternal(...args);
          });
      } catch (error) {
        logger.errorInternal("error translating stack trace: ", error);
        logger.errorInternal(...args);
      }
    };
  }
  return logger;
}

export const logger = intialize();

export default logger;
