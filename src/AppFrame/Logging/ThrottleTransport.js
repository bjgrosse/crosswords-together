const Transport = require("winston-transport");
const Bottleneck = require("bottleneck");
const hash = require("object-hash");

const defaultLimitOptions = {
  maxConcurrent: 1,
  minTime: 500,
  highWater: 0,
  strategy: Bottleneck.strategy.LEAK
};

const defaultKeyProvider = info => hash(info.message);

export default class ThrottleTransport extends Transport {
  constructor(opts) {
    super(opts);

    const transportOptions = { ...opts };
    delete transportOptions.Transport;
    delete transportOptions.timeout;

    this.provideKey = opts.provideKey || defaultKeyProvider;
    this.logger = new opts.transport(transportOptions);

    let limitOptions = Object.assign(
      {},
      defaultLimitOptions,
      opts.limitOptions
    );
    this.LimiterGroup = new Bottleneck.Group(limitOptions);
    this.LimiterGroup.on("created", (limiter, key) => {
      limiter.instanceCount = 0;

      limiter.on("received", queued => {
        limiter.instanceCount++;
      });
      limiter.on("error", err => {
        this.emit("warn", err);
      });
    });
  }

  log(info, callback) {
    setImmediate(() => {
      this.emit("logged", info);
    });

    // Forward the log to the logger
    let limiter = this.LimiterGroup.key(this.provideKey(info));
    limiter.submit(
      (info, callback) => {
        info.instanceCount = limiter.instanceCount;
        limiter.instanceCount = 0;
        this.logger.log(info, callback);

        callback();
      },
      info,
      null
    );

    callback();
  }
}
