import { createLogger } from "winston";

import * as StackTrace from "stacktrace-js";
const Bottleneck = require("bottleneck");
const hash = require("object-hash");

const defaultLimitOptions = {
  maxConcurrent: 1,
  minTime: 5000,
  highWater: 0,
  strategy: Bottleneck.strategy.LEAK
};

const defaultKeyProvider = info => hash(StackTrace.getSync());

export function createThrottledLogger(options) {
  let limitOptions = Object.assign({}, defaultLimitOptions, options.throttle);
  delete options.throttle;

  let logger = createLogger(options);

  logger.LimiterGroup = new Bottleneck.Group(limitOptions);
  logger.LimiterGroup.provideKey =
    limitOptions.provideKey || defaultKeyProvider;
  logger.LimiterGroup.on("created", (limiter, key) => {
    console.log("created limiter: " + key);
    limiter.instanceCount = 0;

    limiter.on("received", queued => {
      limiter.instanceCount++;
    });

    limiter.on("error", err => {
      this.emit("warn", err);
    });
  });

  logger.writeInternal = logger.write;
  logger.write = function(info, encoding, callback) {
    if (callback) {
      throw new Error("callback on write() not supported");
    }

    // Forward the log to the logger
    let limiter = this.LimiterGroup.key(this.LimiterGroup.provideKey(info));
    limiter.submit(
      (info, callback) => {
        info.instanceCount = limiter.instanceCount;
        limiter.instanceCount = 0;
        this.writeInternal(info, encoding);

        callback();
      },
      info,
      null
    );
  };

  return logger;
}
