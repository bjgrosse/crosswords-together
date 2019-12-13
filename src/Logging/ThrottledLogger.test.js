import { createThrottledLogger } from "./ThrottledLogger";
import TestTransport from "./TestTransport";

it("ThrottledLogger outputs a single entry", done => {
  const output = { entries: [] };
  let logger = createThrottledLogger({
    transports: [new TestTransport(output)]
  });

  logger.log("info", "test1");

  setTimeout(() => {
    expect(output.entries.length).toBe(1);
    expect(output.entries[0].message).toBe("test1");
    expect(output.entries[0].instanceCount).toBe(1);
    done();
  }, 1000);
});

it("ThrottledLogger throttles multiple entries", done => {
  const output = { entries: [] };
  let logger = createThrottledLogger({
    transports: [new TestTransport(output)]
  });

  const messageCount = 100;
  for (let i = 0; i <= messageCount - 1; i++) {
    logger.log("info", "test " + i);
  }

  setTimeout(() => {
    // Should only have one entry, the first one,
    // and the instance count property on the entry should equal the
    // number of items logged
    expect(output.entries.length).toBe(1);
    expect(output.entries[0].message).toBe("test 0");
    expect(output.entries[0].instanceCount).toBe(messageCount);
    done();
  }, 1000);
});

it("ThrottledLogger does not throttle spaced entries", done => {
  const throttleTime = 500;
  jest.setTimeout(30000);

  const output = { entries: [] };
  let logger = createThrottledLogger({
    throttle: { provideKey: () => "test", minTime: throttleTime },
    transports: [new TestTransport(output)]
  });

  const messageCount = 5;

  const checkResults = () => {
    // should have one entry for each message
    // and no entry should have an instanceCount > 1
    expect(output.entries.length).toBe(messageCount);
    expect(output.entries.find(x => x.instanceCount > 1)).toBeFalsy();
    done();
  };
  let count = 0;
  const queueNextMessage = () => {
    count++;
    if (count > messageCount) {
      checkResults();
    } else {
      logger.log("info", "test " + count);
      setTimeout(queueNextMessage, throttleTime * 2);
    }
  };

  queueNextMessage();
});

it("ThrottledLogger does not throttle entries from different locations", done => {
  const output = { entries: [] };
  let logger = createThrottledLogger({
    transports: [new TestTransport(output)]
  });

  logger.log("info", "test 1");
  logger.log("info", "test 2");
  logger.log("info", "test 3");
  logger.log("info", "test 4");
  logger.log("info", "test 5");

  setTimeout(() => {
    // should have one entry for each message
    // and no entry should have an instanceCount > 1
    expect(output.entries.length).toBe(5);
    expect(output.entries.find(x => x.instanceCount > 1)).toBeFalsy();
    done();
  }, 500);
});
