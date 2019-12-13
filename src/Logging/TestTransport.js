const Transport = require("winston-transport");

export default class TestTransport extends Transport {
  constructor(opts) {
    super(opts);

    this.entries = opts.entries;
  }

  log(info, callback) {
    setImmediate(() => {
      this.emit("logged", info);
    });

    this.entries.push(info);

    if (callback) {
      callback();
    }
  }
}
