import {describe, test} from 'node:test';
import assert from 'node:assert/strict';
import {once} from 'node:events';
import fs from 'node:fs/promises';
import * as http from 'node:http';
import * as http2 from 'node:http2';
import path from 'node:path';
import Container from '@teqfw/di';
import NamespaceRegistry from '@teqfw/di/node/registry/namespace';
import TeqFw_Web_Back_Server from '../../src/Back/Server.mjs';

const APP_ROOT = path.resolve(import.meta.dirname, '../..');

async function createContainer() {
    const container = new Container();
    const registry = new NamespaceRegistry({fs, path, appRoot: APP_ROOT});
    for (const {prefix, dirAbs, ext} of await registry.build()) {
        container.addNamespaceRoot(prefix, dirAbs, ext);
    }
    container.enableTestMode();
    const loader = await container.get('TeqFw_Cfg_Loader$');
    const object = await container.get('TeqFw_Cfg_Source_Object$');
    await loader.load([object.create({})]);
    return container;
}

/**
 * @returns {TeqFw_Log_Provider}
 */
function createLoggerProvider() {
    return /** @type {TeqFw_Log_Provider} */ (/** @type {*} */ ({
        forSource: () => ({
            info: () => {},
            warn: () => {},
            error: () => {},
        }),
    }));
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

/**
 * @param {string} label
 * @param {Array<*>} log
 * @returns {{listening:boolean,on:(name:string, handler:(req:any,res:any)=>Promise<void>)=>void,listen:(...args:any[])=>void,close:(cb?:Function)=>void,emitRequest:(req:any,res:any)=>Promise<void>}}
 */
function createMockServer(label, log) {
    /** @type {((req:any,res:any)=>Promise<void>)|undefined} */
    let onRequest;
    return {
        listening: false,
        on(name, handler) {
            if (name === 'request') {
                onRequest = handler;
            }
            log.push(`${label}.on`);
        },
        listen(...args) {
            this.listening = true;
            log.push([`${label}.listen`, ...args]);
        },
        close(cb) {
            this.listening = false;
            log.push(`${label}.close`);
            cb?.();
        },
        async emitRequest(req, res) {
            await onRequest?.(req, res);
        },
    };
}

describe('TeqFw_Web_Back_Server integration', () => {
    test('returns 404 through transport when no PROCESS handler completes', async () => {
        const container = await createContainer();
        const runtimeFactory = await container.get('TeqFw_Web_Back_Config_Runtime__Factory$');
        runtimeFactory.freeze();
        const log = /** @type {Array<*>} */ ([]);
        /** @type {*} */
        const mockHttpServer = createMockServer('http', log);
        /** @type {*} */
        const mockHttp = {createServer: () => mockHttpServer};
        /** @type {*} */
        const mockHttp2 = {
            createServer: () => createMockServer('http2', log),
            createSecureServer: () => createMockServer('https', log),
        };

        const server = new TeqFw_Web_Back_Server({
            http: mockHttp,
            http2: mockHttp2,
            config: await container.get('TeqFw_Web_Back_Config_Runtime$'),
            logger: createLoggerProvider(),
            pipelineEngine: await container.get('TeqFw_Web_Back_PipelineEngine$'),
            SERVER_TYPE: await container.get('TeqFw_Web_Back_Enum_Server_Type$'),
        });

        await server.start();
        const res = createResponse();
        await /** @type {*} */ (server.getInstance()).emitRequest({url: '/missing'}, res);

        assert.strictEqual(res.statusCode, 404);
        assert.deepStrictEqual(log, ['http.on', ['http.listen', 3000]]);

        await server.stop();
        assert.strictEqual(server.getInstance(), undefined);
    });

    test('returns 500 through transport when PROCESS handler throws', async () => {
        const container = await createContainer();
        const runtimeFactory = await container.get('TeqFw_Web_Back_Config_Runtime__Factory$');
        runtimeFactory.freeze();
        const STAGE = await container.get('TeqFw_Web_Back_Enum_Stage$');
        const pipelineEngine = await container.get('TeqFw_Web_Back_PipelineEngine$');
        pipelineEngine.addHandler({
            getRegistrationInfo: () => ({name: 'Boom', stage: STAGE.PROCESS}),
            handle: async () => {
                throw new Error('boom');
            },
        });

        const server = new TeqFw_Web_Back_Server({
            http: /** @type {*} */ ({createServer: () => createMockServer('http', [])}),
            http2: /** @type {*} */ ({
                createServer: () => createMockServer('http2', []),
                createSecureServer: () => createMockServer('https', []),
            }),
            config: await container.get('TeqFw_Web_Back_Config_Runtime$'),
            logger: createLoggerProvider(),
            pipelineEngine,
            SERVER_TYPE: await container.get('TeqFw_Web_Back_Enum_Server_Type$'),
        });

        await server.start();
        const res = createResponse();
        await /** @type {*} */ (server.getInstance()).emitRequest({url: '/boom'}, res);

        assert.strictEqual(res.statusCode, 500);
        assert.strictEqual(res.body, 'Internal Server Error');

        await server.stop();
    });

    test('binds the native HTTP server to an explicitly configured host', async () => {
        const container = await createContainer();
        const runtimeFactory = await container.get('TeqFw_Web_Back_Config_Runtime__Factory$');
        runtimeFactory.freeze();

        const server = new TeqFw_Web_Back_Server({
            http,
            http2,
            config: await container.get('TeqFw_Web_Back_Config_Runtime$'),
            logger: createLoggerProvider(),
            pipelineEngine: await container.get('TeqFw_Web_Back_PipelineEngine$'),
            SERVER_TYPE: await container.get('TeqFw_Web_Back_Enum_Server_Type$'),
        });

        try {
            await server.start(/** @type {*} */ ({host: '127.0.0.1', port: 0, type: 'http'}));
            const instance = server.getInstance();
            if (!instance) throw new Error('Server not started');
            if (!instance.listening) await once(instance, 'listening');
            const address = instance.address();

            assert.equal(typeof address, 'object');
            assert.equal(address && typeof address === 'object' ? address.address : null, '127.0.0.1');
        } finally {
            await server.stop();
        }
    });
});
