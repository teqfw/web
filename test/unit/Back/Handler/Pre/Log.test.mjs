import {describe, test, beforeEach} from 'node:test';
import assert from 'node:assert/strict';
import TeqFw_Web_Back_Handler_Pre_Log from '../../../../../src/Back/Handler/Pre/Log.mjs';
import {Factory as TeqFw_Web_Back_Dto_Info_Factory} from '../../../../../src/Back/Dto/Info.mjs';
import TeqFw_Web_Back_Helper_Cast from '../../../../../src/Back/Helper/Cast.mjs';

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
    const cast = new TeqFw_Web_Back_Helper_Cast();
    const dtoInfoFactory = new TeqFw_Web_Back_Dto_Info_Factory({cast, STAGE});
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
