import {describe, test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import Container from '@teqfw/di';
import NamespaceRegistry from '@teqfw/di/node/registry/namespace';

const APP_ROOT = path.resolve(import.meta.dirname, '../..');

async function createContainer() {
    const container = new Container();
    const registry = new NamespaceRegistry({fs, path, appRoot: APP_ROOT});
    for (const {prefix, dirAbs, ext} of await registry.build()) {
        container.addNamespaceRoot(prefix, dirAbs, ext);
    }
    container.enableTestMode();
    return container;
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

describe('TeqFw_Web_Back_PipelineEngine integration', () => {
    test('requires locked handlers before direct request execution', async () => {
        const container = await createContainer();
        const engine = await container.get('TeqFw_Web_Back_PipelineEngine$');
        const STAGE = await container.get('TeqFw_Web_Back_Enum_Stage$');

        engine.addHandler({
            getRegistrationInfo: () => ({name: 'Process', stage: STAGE.PROCESS}),
            handle: async () => {},
        });

        await assert.rejects(
            () => engine.handleRequest({url: '/early'}, createResponse()),
            /must be locked before request execution/
        );
    });

    test('stops PROCESS stage after completion and still executes FINALIZE', async () => {
        const container = await createContainer();
        const engine = await container.get('TeqFw_Web_Back_PipelineEngine$');
        const STAGE = await container.get('TeqFw_Web_Back_Enum_Stage$');
        /** @type {string[]} */
        const log = [];

        engine.addHandler({
            getRegistrationInfo: () => ({name: 'Init', stage: STAGE.INIT}),
            handle: async () => { log.push('init'); },
        });
        engine.addHandler({
            getRegistrationInfo: () => ({name: 'ProcessA', stage: STAGE.PROCESS}),
            handle: async (/** @type {TeqFw_Web_Back_Dto_RequestContext} */ context) => {
                log.push('processA');
                context.completed = true;
            },
        });
        engine.addHandler({
            getRegistrationInfo: () => ({name: 'ProcessB', stage: STAGE.PROCESS}),
            handle: async () => { log.push('processB'); },
        });
        engine.addHandler({
            getRegistrationInfo: () => ({name: 'Finalize', stage: STAGE.FINALIZE}),
            handle: async () => { log.push('finalize'); },
        });
        engine.orderHandlers();

        await engine.handleRequest({url: '/'}, createResponse());

        assert.deepStrictEqual(log, ['init', 'processA', 'finalize']);
    });

    test('produces 500 on PROCESS exception', async () => {
        const container = await createContainer();
        const engine = await container.get('TeqFw_Web_Back_PipelineEngine$');
        const STAGE = await container.get('TeqFw_Web_Back_Enum_Stage$');
        engine.addHandler({
            getRegistrationInfo: () => ({name: 'Boom', stage: STAGE.PROCESS}),
            handle: async () => {
                throw new Error('boom');
            },
        });
        engine.orderHandlers();

        const res = createResponse();
        await engine.handleRequest({url: '/boom'}, res);

        assert.strictEqual(res.statusCode, 500);
        assert.strictEqual(res.body, 'Internal Server Error');
    });
});
