import {beforeEach, describe, test} from 'node:test';
import assert from 'node:assert/strict';
import TeqFw_Web_Back_Handler_Static from '../../../../src/Back/Handler/Static.mjs';

describe('TeqFw_Web_Back_Handler_Static', () => {
    const STAGE = /** @type {*} */ ({PROCESS: 'PROCESS'});
    const dtoInfoFactory = /** @type {*} */ ({create: (/** @type {*} */ info) => info});
    /** @type {*} */
    let registry;
    /** @type {*} */
    let fileService;
    /** @type {*} */
    let respond;
    /** @type {*} */
    let handler;

    beforeEach(() => {
        registry = {
            addConfigs: () => {},
            find: () => null,
        };
        fileService = {
            serve: async () => false,
        };
        respond = {
            isWritable: () => true,
        };
        handler = new TeqFw_Web_Back_Handler_Static({
            registry,
            fileService,
            respond,
            dtoInfoFactory,
            STAGE,
        });
    });

    test('uses PROCESS stage registration info', () => {
        const info = handler.getRegistrationInfo();
        assert.strictEqual(info.stage, STAGE.PROCESS);
        assert.strictEqual(info.name, 'TeqFw_Web_Back_Handler_Static');
    });

    test('marks request completed when file is served', async () => {
        registry.find = () => /** @type {*} */ ({config: {}, rel: 'file.txt'});
        fileService.serve = async () => true;
        const context = /** @type {*} */ ({
            request: {method: 'GET', url: '/file.txt'},
            response: {},
            completed: false,
        });

        await handler.handle(context);

        assert.strictEqual(context.completed, true);
    });

    test('does nothing when no source matches request', async () => {
        const context = /** @type {*} */ ({
            request: {method: 'GET', url: '/missing'},
            response: {},
            completed: false,
        });

        await handler.handle(context);

        assert.strictEqual(context.completed, false);
    });
    test('other methods pass through before malformed URL processing', async () => {
        registry.find = () => { throw new Error('must not look up'); };
        const context = /** @type {*} */ ({request: {method: 'POST', url: '/%zz'}, response: {}, completed: false});
        await handler.handle(context);
        assert.equal(context.completed, false);
    });

    test('malformed encoding and decoded NUL produce 400 with no HEAD body', async () => {
        for (const url of ['/%zz', '/%ff', '/%00']) {
            const res = /** @type {*} */ ({writeHead(/** @type {number} */ status) { this.status = status; }, end(/** @type {string|undefined} */ body) { this.body = body; }});
            const context = /** @type {*} */ ({request: {method: 'HEAD', url}, response: res, completed: false});
            await handler.handle(context);
            assert.equal(res.status, 400);
            assert.equal(res.body, undefined);
            assert.equal(context.completed, true);
        }
    });

});
