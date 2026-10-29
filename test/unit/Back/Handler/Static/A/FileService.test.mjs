import {test} from 'node:test';
import assert from 'node:assert/strict';
import FileService from '../../../../../../src/Back/Handler/Static/A/FileService.mjs';

test('unexpected resolution errors produce a generic HEAD-safe error', async () => {
    const logs = [];
    const service = new FileService({fs: /** @type {*} */ ({}), http2: /** @type {*} */ ({constants: {}}), path: /** @type {*} */ ({}),
        logger: /** @type {*} */ ({forSource: () => ({info() {}, warn() {}, error: (/** @type {*} */ msg) => logs.push(msg)})}),
        helpMime: /** @type {*} */ ({}), resolver: /** @type {*} */ ({resolve: () => { throw new Error('private path'); }}), fallback: /** @type {*} */ ({})});
    for (const method of ['GET', 'HEAD']) {
        const response = /** @type {*} */ ({headersSent: false, writableEnded: false, writeHead(/** @type {number} */ status) { this.status = status; }, end(/** @type {string|undefined} */ body) { this.body = body; }});
        assert.equal(await service.serve(/** @type {*} */ ({}), 'file', {method}, response), true);
        assert.equal(response.status, 500);
        assert.equal(response.body, method === 'HEAD' ? undefined : 'Internal Server Error');
    }
    assert.equal(logs.length, 2);
});

test('missing and denied filesystem errors pass through without a response', async () => {
    for (const code of ['ENOENT', 'ENOTDIR', 'EACCES', 'EPERM']) {
        const failure = Object.assign(new Error('injected'), {code});
        const service = new FileService({fs: /** @type {*} */ ({}), http2: /** @type {*} */ ({constants: {}}), path: /** @type {*} */ ({}),
            logger: /** @type {*} */ ({forSource: () => ({info() {}, warn() {}, error() {}})}), helpMime: /** @type {*} */ ({}),
            resolver: /** @type {*} */ ({resolve: () => { throw failure; }}), fallback: /** @type {*} */ ({})});
        let replied = false;
        const response = /** @type {*} */ ({headersSent: false, writableEnded: false, writeHead() { replied = true; }, end() { replied = true; }});
        assert.equal(await service.serve(/** @type {*} */ ({}), 'file', {method: 'GET'}, response), false);
        assert.equal(replied, false);
    }
});
