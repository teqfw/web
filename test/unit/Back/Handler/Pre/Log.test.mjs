import {describe, test, beforeEach} from 'node:test';
import assert from 'node:assert/strict';
import TeqFw_Web_Back_Handler_Pre_Log from '../../../../../src/Back/Handler/Pre/Log.mjs';

/**
 * @param {Array<*>} log
 * @returns {*}
 */
function createLoggerProvider(log) {
    return {
        forSource: () => ({
            debug: (/** @type {string} */ msg) => log.push(msg),
        }),
    };
}

describe('TeqFw_Web_Back_Handler_Pre_Log', () => {
    /** @type {Array<*>} */
    const log = [];
    const STAGE = Object.freeze({INIT: 'INIT', PROCESS: 'PROCESS', FINALIZE: 'FINALIZE'});
    const dtoInfoFactory = /** @type {*} */ ({create: (/** @type {*} */ value) => value});
    /** @type {*} */
    let logger;

    beforeEach(() => {
        log.length = 0;
        logger = createLoggerProvider(log);
    });

    test('logs method and url', async () => {
        /** @type {TeqFw_Web_Back_Handler_Pre_Log} */
        const handler = new TeqFw_Web_Back_Handler_Pre_Log({logger, dtoInfoFactory, STAGE});
        assert.strictEqual(handler.getRegistrationInfo().name, 'TeqFw_Web_Back_Handler_Pre_Log');
        await handler.handle(/** @type {*} */ ({request: {method: 'GET', url: '/path'}}));
        assert.deepStrictEqual(log, ['GET /path']);
    });
});
