import { createLogger, transports } from 'winston';

import ThrottleTransport from './ThrottleTransport'
import TestTransport from './TestTransport'





it('ThrottleTransport outputs a single entry', (done) => {
    const options = {
        entries: [],
        transport: TestTransport
    }
    const logger = createLogger({
        transports: [
            new ThrottleTransport(options)
        ]
    })

    logger.log("info", "test1")

    setTimeout(() => {
        expect(options.entries.length).toBe(1)
        expect(options.entries[0].message).toBe("test1")
        done()
    }, 1000)
});

it('ThrottleTransport throttles multiple entries', (done) => {
    const options = {
        entries: [],
        provideKey: () => 'test',
        transport: TestTransport
    }
    const logger = createLogger({
        transports: [
            new ThrottleTransport(options)
        ]
    })

    const messageCount = 100
    for (let i = 0; i <= messageCount - 1; i++) {
        logger.log("info", "test " + i)
    }

    setTimeout(() => {
        // Should only have one entry, the first one,
        // and the instance count property on the entry should equal the 
        // number of items logged
        expect(options.entries.length).toBe(1)
        expect(options.entries[0].message).toBe("test 0")
        expect(options.entries[0].instanceCount).toBe(messageCount)
        done()
    }, 1000)

});


it('ThrottleTransport does not throttle spaced entries', (done) => {
    const throttleTime = 500;
    jest.setTimeout(30000);
    const options = {
        entries: [],
        provideKey: () => 'test',
        minTime: throttleTime,
        transport: TestTransport
    }
    const logger = createLogger({
        transports: [
            new ThrottleTransport(options)
        ]
    })

    const messageCount = 5

    const checkResults = () => {
        // should have one entry for each message
        // and no entry should have an instanceCount > 1
        expect(options.entries.length).toBe(messageCount)        
        expect(options.entries.find(x=>x.instanceCount > 1)).toBeFalsy()
        done()
    }
    let count = 0
    const queueNextMessage = () => {
        count++
        if (count > messageCount) {
            checkResults()
        } else {
            logger.log("info", "test " + count)
            setTimeout(queueNextMessage, throttleTime * 2)
        }
    }

    queueNextMessage()
});