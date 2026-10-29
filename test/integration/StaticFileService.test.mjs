import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import * as http2 from 'node:http2';
import {Writable} from 'node:stream';
import {once} from 'node:events';
import FileService from '../../src/Back/Handler/Static/A/FileService.mjs';
import Resolver from '../../src/Back/Handler/Static/A/Resolver.mjs';
import Fallback from '../../src/Back/Handler/Static/A/Fallback.mjs';

class Response extends Writable {
    constructor() { super(); this.headersSent = false; this.status = 0; this.body = ''; }
    /** @param {number} status */
    writeHead(status) { this.status = status; this.headersSent = true; }
    /** @param {Buffer} chunk @param {BufferEncoding} _encoding @param {(error?: Error|null) => void} callback */
    _write(chunk, _encoding, callback) { this.body += chunk.toString(); callback(); }
}

test('serves files and HEAD while denying symlinks outside the root', async () => {
    const temp = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'teqfw-static-'));
    try {
        const root = path.join(temp, 'root');
        await fs.promises.mkdir(root);
        await fs.promises.writeFile(path.join(root, 'a.txt'), 'hello');
        await fs.promises.writeFile(path.join(temp, 'secret.txt'), 'secret');
        await fs.promises.symlink(path.join(temp, 'secret.txt'), path.join(root, 'escape.txt'));
        await fs.promises.symlink(path.join(root, 'a.txt'), path.join(root, 'inside.txt'));
        await fs.promises.mkdir(path.join(root, 'dir'));
        await fs.promises.symlink(path.join(temp, 'secret.txt'), path.join(root, 'dir', 'index.html'));
        const service = new FileService({fs, http2, path, logger: /** @type {*} */ ({forSource: () => ({info() {}, warn() {}, error() {}})}),
            helpMime: /** @type {*} */ ({getByExt: () => 'text/plain'}), resolver: new Resolver({path}), fallback: new Fallback({fs, path})});
        const config = {root, prefix: '/', defaults: ['index.html'], allow: undefined};
        const get = new Response();
        const finished = once(get, 'finish');
        assert.equal(await service.serve(config, 'a.txt', {method: 'GET'}, /** @type {*} */ (get)), true);
        await finished;
        assert.equal(get.body, 'hello');
        const head = new Response();
        assert.equal(await service.serve(config, 'a.txt', {method: 'HEAD'}, /** @type {*} */ (head)), true);
        assert.equal(head.body, '');
        assert.equal(head.status, 200);
        const inside = new Response();
        const insideFinished = once(inside, 'finish');
        assert.equal(await service.serve(config, 'inside.txt', {method: 'GET'}, /** @type {*} */ (inside)), true);
        await insideFinished;
        assert.equal(inside.body, 'hello');
        assert.equal(await service.serve(config, 'dir', {method: 'GET'}, /** @type {*} */ (new Response())), false);
        assert.equal(await service.serve(config, 'escape.txt', {method: 'GET'}, /** @type {*} */ (new Response())), false);
        assert.equal(await service.serve(config, 'missing', {method: 'GET'}, /** @type {*} */ (new Response())), false);
    } finally { await fs.promises.rm(temp, {recursive: true, force: true}); }
});

test('unexpected file errors return 500 without exposing the path, including HEAD', async () => {
    const error = Object.assign(new Error('private filesystem path'), {code: 'EIO'});
    const service = new FileService({fs, http2, path, logger: /** @type {*} */ ({forSource: () => ({info() {}, warn() {}, error() {}})}),
        helpMime: /** @type {*} */ ({getByExt: () => 'text/plain'}), resolver: new Resolver({path}),
        fallback: /** @type {*} */ ({apply: async () => { throw error; }})});
    for (const method of ['GET', 'HEAD']) {
        const res = new Response();
        assert.equal(await service.serve({root: '/tmp', prefix: '/', defaults: [], allow: undefined}, 'file', {method}, /** @type {*} */ (res)), true);
        assert.equal(res.status, 500);
        assert.equal(res.body, method === 'HEAD' ? '' : 'Internal Server Error');
    }
});

/** @param {import('node:test').TestContext} t @param {'failure'|'disconnect'} mode */
async function streamingFixture(t, mode) {
    const {Readable} = await import('node:stream');
    const http = await import('node:http');
    const temp = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'teqfw-static-stream-'));
    await fs.promises.writeFile(path.join(temp, 'data.txt'), '0123456789');
    /** @type {import('node:stream').Readable|undefined} */
    let source;
    /** @type {unknown[]} */
    const errors = [];
    const fakeFs = /** @type {typeof fs} */ (/** @type {*} */ ({promises: fs.promises, createReadStream: () => {
        source = new Readable({read() {}});
        const current = source;
        setImmediate(() => {
            current.push('data');
            if (mode === 'failure') setImmediate(() => current.destroy(new Error('injected read failure')));
        });
        return current;
    }}));
    const service = new FileService({fs: fakeFs, http2, path, logger: /** @type {*} */ ({forSource: () => ({info() {}, warn() {}, error: (/** @type {*} */ message) => errors.push(message)})}),
        helpMime: /** @type {*} */ ({getByExt: () => 'text/plain'}), resolver: new Resolver({path}), fallback: new Fallback({fs, path})});
    const config = {root: temp, prefix: '/', defaults: [], allow: undefined};
    const server = http.createServer((req, res) => { void service.serve(config, 'data.txt', req, res); });
    await new Promise(resolve => server.listen(0, '127.0.0.1', () => resolve(undefined)));
    t.after(async () => {
        source?.destroy();
        server.closeAllConnections();
        await new Promise(resolve => server.close(() => resolve(undefined)));
        await fs.promises.rm(temp, {recursive: true, force: true});
    });
    const address = /** @type {import('node:net').AddressInfo} */ (server.address());
    const request = http.get({host: '127.0.0.1', port: address.port});
    t.after(() => request.destroy());
    const [response] = /** @type {[import('node:http').IncomingMessage]} */ (await once(request, 'response'));
    response.on('error', () => {});
    return {response, errors, getSource: () => source};
}

test('read failure after headers aborts the response without a second reply', {timeout: 5000}, async t => {
    const {response, errors} = await streamingFixture(t, 'failure');
    const closed = new Promise(resolve => response.once('close', resolve));
    response.resume();
    await closed;
    assert.equal(response.statusCode, 200);
    assert.equal(response.complete, false);
    assert.deepEqual(errors, ['Static stream failed']);
});

test('client disconnect destroys the source stream without reporting a read failure', {timeout: 5000}, async t => {
    const {response, errors, getSource} = await streamingFixture(t, 'disconnect');
    const source = getSource();
    assert.ok(source);
    const closed = new Promise(resolve => source.once('close', resolve));
    await once(response, 'data');
    response.destroy();
    await closed;
    assert.equal(source.destroyed, true);
    assert.deepEqual(errors, []);
});
