import { createLogger } from "winston";

import TestTransport from "./TestTransport";

it("TestTransport outputs a log", () => {
  const output = { entries: [] };
  const logger = createLogger({ transports: [new TestTransport(output)] });

  logger.log("info", "test1");

  expect(output.entries.length).toBe(1);
  expect(output.entries[0].message).toBe("test1");
});
