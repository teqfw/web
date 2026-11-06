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

test('static file diagnostics include safe route and request ID without filesystem paths or query', async () => {
    const records = [];
    const service = new FileService({fs: /** @type {*} */ ({}), http2: /** @type {*} */ ({constants: {}}), path: /** @type {*} */ ({}),
        logger: /** @type {*} */ ({forSource: () => ({info: (message, data) => records.push({level:'info',message,data}),
            warn: (message, data) => records.push({level:'warn',message,data}),error: (message, data) => records.push({level:'error',message,data})})}),
        helpMime: /** @type {*} */ ({}), resolver: /** @type {*} */ ({resolve: () => {throw Object.assign(new Error('/private/root?token=secret'),{code:'EACCES'});}}),
        fallback: /** @type {*} */ ({})});
    const response = /** @type {*} */ ({headersSent:false,writableEnded:false,writeHead() {},end() {}});
    assert.equal(await service.serve(/** @type {*} */ ({}),'file',{method:'GET',url:'/assets/file?token=secret'},response,'req-42'),false);
    assert.deepStrictEqual(records[0],{level:'warn',message:'Static file access denied',data:{requestId:'req-42',route:'/assets/file',stage:'static.resolve',code:'STATIC_FILE_ACCESS_DENIED'}});
    assert.doesNotMatch(JSON.stringify(records),/secret|private\/root/);
});

test('unexpected static file errors expose a safe code without the original exception', async () => {
    const records = [];
    const service = new FileService({fs: /** @type {*} */ ({}), http2: /** @type {*} */ ({constants: {}}), path: /** @type {*} */ ({}),
        logger: /** @type {*} */ ({forSource: () => ({info() {},warn() {},error: (message, data) => records.push({message,data})})}),
        helpMime: /** @type {*} */ ({}), resolver: /** @type {*} */ ({resolve: () => {throw new Error('private path');}}),
        fallback: /** @type {*} */ ({})});
    const response = /** @type {*} */ ({headersSent:false,writableEnded:false,writeHead() {},end() {}});
    await service.serve(/** @type {*} */ ({}),'file',{method:'GET',url:'/assets/file?secret=hidden'},response,'req-500');
    assert.equal(records[0].data.code,'STATIC_FILE_FAILED');
    assert.equal(records[0].data.err.message,'STATIC_FILE_FAILED');
    assert.equal(records[0].data.route,'/assets/file');
    assert.equal(records[0].data.requestId,'req-500');
    assert.doesNotMatch(JSON.stringify(records),/private path|hidden/);
});
