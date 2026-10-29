import {beforeEach, describe, test} from 'node:test';
import assert from 'node:assert/strict';
import TeqFw_Web_Back_PipelineEngine from '../../../src/Back/PipelineEngine.mjs';

/**
 * @param {{errors: string[], exceptions: string[]}} sources
 * @returns {*}
 */
function createLoggerProvider({errors, exceptions}) {
    return {
        forSource: () => ({
            error(/** @type {string} */ message, /** @type {*} */ data) {
                errors.push(message);
                if (data?.err) exceptions.push(String(data.err.message ?? data.err));
            },
        }),
    };
}

/**
 * @returns {{headersSent:boolean,writableEnded:boolean,statusCode?:number,body?:string,writeHead:(status:number)=>void,end:(body?:string)=>void}}
 */
function createResponse() {
    return {
        headersSent: false,
        writableEnded: false,
        statusCode: undefined,
        body: undefined,
        writeHead(status) {
            this.statusCode = status;
            this.headersSent = true;
        },
        end(body = '') {
            this.body = body;
            this.writableEnded = true;
        },
    };
}

describe('TeqFw_Web_Back_PipelineEngine', () => {
    const STAGE = {INIT: 'INIT', PROCESS: 'PROCESS', FINALIZE: 'FINALIZE'};
    /** @type {string[]} */
    let log;
    /** @type {string[]} */
    let errors;
    /** @type {string[]} */
    let exceptions;
    /** @type {*} */
    let respond;
    /** @type {*} */
    let logger;
    /** @type {TeqFw_Web_Back_Helper_Order_Kahn} */
    let helpOrder;
    /** @type {TeqFw_Web_Back_Dto_RequestContext__Factory} */
    let dtoRequestContextFactory;

    beforeEach(() => {
        log = [];
        errors = [];
        exceptions = [];
        respond = {
            isWritable: (/** @type {*} */ res) => !res.headersSent && !res.writableEnded,
            code404_NotFound: (/** @type {{res: *}} */ {res}) => {
                res.writeHead(404);
                res.end('Not Found');
            },
            code500_InternalServerError: (/** @type {{res: *, body?: string}} */ {res, body = 'Internal Server Error'}) => {
                res.writeHead(500);
                res.end(body);
            },
        };
        logger = createLoggerProvider({errors, exceptions});
        helpOrder = {sort: (items) => items};
        dtoRequestContextFactory = /** @type {*} */ ({create: () => ({})});
    });

    /**
     * @param {string} name
     * @param {string} stage
     * @param {(context:any)=>Promise<void>} handle
     */
    function mkHandler(name, stage, handle) {
        return {
            getRegistrationInfo: () => ({name, stage, before: [], after: []}),
            handle,
        };
    }

    test('executes INIT, PROCESS and FINALIZE in order', async () => {
        const engine = new TeqFw_Web_Back_PipelineEngine({
            dtoRequestContextFactory, logger, respond, helpOrder, STAGE
        });
        engine.addHandler(mkHandler('init', STAGE.INIT, async () => { log.push('init'); }));
        engine.addHandler(mkHandler('processA', STAGE.PROCESS, async (context) => {
            log.push('processA');
            context.completed = true;
        }));
        engine.addHandler(mkHandler('processB', STAGE.PROCESS, async () => { log.push('processB'); }));
        engine.addHandler(mkHandler('finalize', STAGE.FINALIZE, async () => { log.push('finalize'); }));
        engine.orderHandlers();

        await engine.onEventRequest(/** @type {*} */ ({url: '/ok'}), /** @type {*} */ (createResponse()));

        assert.deepStrictEqual(log, ['init', 'processA', 'finalize']);
    });

    test('returns 404 when no PROCESS handler completes context', async () => {
        const engine = new TeqFw_Web_Back_PipelineEngine({
            dtoRequestContextFactory, logger, respond, helpOrder, STAGE
        });
        engine.addHandler(mkHandler('process', STAGE.PROCESS, async () => { log.push('process'); }));
        engine.orderHandlers();

        const res = /** @type {*} */ (createResponse());
        await engine.onEventRequest(/** @type {*} */ ({url: '/missing'}), res);

        assert.strictEqual(res.statusCode, 404);
        assert.match(errors[0], /404 Not Found/);
    });

    test('returns 500 and still runs FINALIZE on process error', async () => {
        const engine = new TeqFw_Web_Back_PipelineEngine({
            dtoRequestContextFactory, logger, respond, helpOrder, STAGE
        });
        engine.addHandler(mkHandler('process', STAGE.PROCESS, async () => {
            throw new Error('boom');
        }));
        engine.addHandler(mkHandler('finalize', STAGE.FINALIZE, async () => { log.push('finalize'); }));
        engine.orderHandlers();

        const res = /** @type {*} */ (createResponse());
        await engine.onEventRequest(/** @type {*} */ ({url: '/err'}), res);

        assert.strictEqual(res.statusCode, 500);
        assert.deepStrictEqual(log, ['finalize']);
        assert.deepStrictEqual(exceptions, ['boom']);
    });

    test('isolates INIT handler errors and continues processing', async () => {
        const engine = new TeqFw_Web_Back_PipelineEngine({
            dtoRequestContextFactory, logger, respond, helpOrder, STAGE
        });
        engine.addHandler(mkHandler('init', STAGE.INIT, async (context) => {
            context.completed = true;
        }));
        engine.addHandler(mkHandler('process', STAGE.PROCESS, async (context) => {
            log.push('process');
            context.completed = true;
        }));
        engine.orderHandlers();

        const res = /** @type {*} */ (createResponse());
        await engine.onEventRequest(/** @type {*} */ ({url: '/ok'}), res);

        assert.deepStrictEqual(log, ['process']);
        assert.deepStrictEqual(exceptions, ['Only PROCESS handlers may complete request processing']);
        assert.strictEqual(res.statusCode, undefined);
    });

    test('locks registration after ordering', () => {
        const engine = new TeqFw_Web_Back_PipelineEngine({
            dtoRequestContextFactory, logger, respond, helpOrder, STAGE
        });
        engine.addHandler(mkHandler('process', STAGE.PROCESS, async () => {}));
        engine.orderHandlers();

        assert.throws(
            () => engine.addHandler(mkHandler('late', STAGE.PROCESS, async () => {})),
            /registration is locked/
        );
    });

    test('rejects request execution before handlers are locked', async () => {
        const engine = new TeqFw_Web_Back_PipelineEngine({
            dtoRequestContextFactory, logger, respond, helpOrder, STAGE
        });
        engine.addHandler(mkHandler('process', STAGE.PROCESS, async () => {}));

        await assert.rejects(
            () => engine.onEventRequest(/** @type {*} */ ({url: '/early'}), /** @type {*} */ (createResponse())),
            /must be locked before request execution/
        );
    });
    test('rejects duplicate names and cross-stage constraints', () => {
        const engine = new TeqFw_Web_Back_PipelineEngine({dtoRequestContextFactory, logger, respond, helpOrder, STAGE});
        engine.addHandler(mkHandler('init', STAGE.INIT, async () => {}));
        assert.throws(() => engine.addHandler(mkHandler('init', STAGE.PROCESS, async () => {})), /Duplicate/);
        engine.addHandler({getRegistrationInfo: () => ({name: 'process', stage: STAGE.PROCESS, before: [], after: ['init']}), handle: async () => {}});
        assert.throws(() => engine.lockHandlers(), /another stage/);
    });

    test('terminates safely when INIT has started the response', async () => {
        const engine = new TeqFw_Web_Back_PipelineEngine({dtoRequestContextFactory, logger, respond, helpOrder, STAGE});
        engine.addHandler(mkHandler('init', STAGE.INIT, async ctx => { ctx.response.writeHead(200); }));
        engine.addHandler(mkHandler('process', STAGE.PROCESS, async () => { log.push('unexpected'); }));
        engine.addHandler(mkHandler('final', STAGE.FINALIZE, async () => { log.push('final'); }));
        engine.lockHandlers();
        await engine.handleRequest(/** @type {*} */ ({url: '/'}), /** @type {*} */ (createResponse()));
        assert.deepEqual(log, ['final']);
    });

    test('overlapping requests keep data isolated and finalize before streams end', async () => {
        const engine = new TeqFw_Web_Back_PipelineEngine({dtoRequestContextFactory, logger, respond, helpOrder, STAGE});
        /** @type {Array<() => void>} */
        const release = [];
        /** @type {Array<{url: string, value: unknown, ended: boolean}>} */
        const seen = [];
        engine.addHandler(mkHandler('stream', STAGE.PROCESS, async ctx => {
            ctx.data.value = ctx.request.url;
            ctx.completed = true;
            await new Promise(resolve => release.push(() => resolve(undefined)));
        }));
        engine.addHandler(mkHandler('final', STAGE.FINALIZE, async ctx => {
            seen.push({url: ctx.request.url, value: ctx.data.value, ended: ctx.response.writableEnded});
        }));
        engine.lockHandlers();
        const first = engine.handleRequest(/** @type {*} */ ({url: '/a'}), /** @type {*} */ (createResponse()));
        const second = engine.handleRequest(/** @type {*} */ ({url: '/b'}), /** @type {*} */ (createResponse()));
        assert.equal(release.length, 2);
        release[1]();
        release[0]();
        await Promise.all([first, second]);
        assert.deepEqual(seen, [{url: '/b', value: '/b', ended: false}, {url: '/a', value: '/a', ended: false}]);
    });

});
