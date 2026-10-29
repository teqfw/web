import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as http from 'node:http';
import * as http2 from 'node:http2';
import Server from '../../../src/Back/Server.mjs';

function make() {
    const controller = new AbortController();
    const lifecycle = {shutdownSignal: controller.signal};
    const server = new Server({http, http2, config: /** @type {*} */ ({host: '127.0.0.1', port: 0, type: 'http', shutdownTimeout: 30}),
        logger: /** @type {*} */ ({forSource: () => ({info() {}, error() {}, warn() {}})}),
        pipelineEngine: /** @type {*} */ ({lockHandlers() {}, handleRequest() {}}),
        SERVER_TYPE: /** @type {*} */ ({HTTP: 'http', HTTP2: 'http2', HTTPS: 'https'}), lifecycle: {beginShutdown: () => controller.abort()}});
    return {server, lifecycle};
}

test('stopping before start announces shutdown and prevents start', async () => {
    const {server, lifecycle} = make();
    await server.stop();
    assert.equal(lifecycle.shutdownSignal.aborted, true);
    await server.stop();
    await assert.rejects(server.start(), /once/);
});

test('awaits readiness, rejects a second start and shares stop', async () => {
    const {server, lifecycle} = make();
    await server.start();
    assert.equal(server.getInstance()?.listening, true);
    await assert.rejects(server.start(), /once/);
    assert.equal(lifecycle.shutdownSignal.aborted, false);
    await Promise.all([server.stop(), server.stop()]);
    assert.equal(lifecycle.shutdownSignal.aborted, true);
    await assert.rejects(server.start(), /once/);
});

test('stop racing startup cancels readiness without leaving a listener', async () => {
    const {server, lifecycle} = make();
    const starting = server.start();
    const stopping = server.stop();
    await assert.rejects(starting, /cancelled/);
    await stopping;
    assert.equal(lifecycle.shutdownSignal.aborted, true);
    assert.equal(server.getInstance(), undefined);
});

test('bind failure rejects start and activates the lifecycle signal', async () => {
    const occupied = http.createServer();
    await new Promise(resolve => occupied.listen(0, '127.0.0.1', () => resolve(undefined)));
    const address = /** @type {import('node:net').AddressInfo} */ (occupied.address());
    const {server, lifecycle} = make();
    try {
        await assert.rejects(server.start(/** @type {*} */ ({port: address.port})), /EADDRINUSE/);
        assert.equal(lifecycle.shutdownSignal.aborted, true);
        await server.stop();
        await assert.rejects(server.start(), /once/);
    } finally {
        await new Promise(resolve => occupied.close(resolve));
    }
});

test('secure transport receives TLS values from a configuration facade', async () => {
    const controller = new AbortController();
    let options;
    const facade = new Proxy({}, {get: (_target, key) => ({key: 'test-key', cert: 'test-cert', ca: 'test-ca'})[/** @type {'key'|'cert'|'ca'} */ (key)]});
    const fakeHttp2 = /** @type {*} */ ({createSecureServer: (/** @type {*} */ params) => { options = params; throw new Error('captured'); }});
    const server = new Server({http, http2: fakeHttp2, config: /** @type {*} */ ({host: '127.0.0.1', port: 0, type: 'https', tls: facade}),
        logger: /** @type {*} */ ({forSource: () => ({info() {}, error() {}, warn() {}})}),
        pipelineEngine: /** @type {*} */ ({lockHandlers() {}, handleRequest() {}}),
        SERVER_TYPE: /** @type {*} */ ({HTTP: 'http', HTTP2: 'http2', HTTPS: 'https'}), lifecycle: {beginShutdown: () => controller.abort()}});
    await assert.rejects(server.start(), /captured/);
    assert.deepEqual(options, {key: 'test-key', cert: 'test-cert', ca: 'test-ca', allowHTTP1: true});
});

test('close failure is retained across concurrent and later stop calls', async () => {
    const {EventEmitter} = await import('node:events');
    const native = /** @type {*} */ (new EventEmitter());
    native.listen = () => queueMicrotask(() => native.emit('listening'));
    let attempts = 0;
    native.close = (/** @type {(err: Error) => void} */ callback) => { attempts++; queueMicrotask(() => callback(new Error('close failed'))); };
    const transport = /** @type {*} */ ({createServer: () => native});
    const controller = new AbortController();
    const server = new Server({http: transport, http2, config: /** @type {*} */ ({port: 0, type: 'http', shutdownTimeout: 10}),
        logger: /** @type {*} */ ({forSource: () => ({info() {}, error() {}, warn() {}})}),
        pipelineEngine: /** @type {*} */ ({lockHandlers() {}, handleRequest() {}}),
        SERVER_TYPE: /** @type {*} */ ({HTTP: 'http', HTTP2: 'http2', HTTPS: 'https'}), lifecycle: {beginShutdown: () => controller.abort()}});
    await server.start();
    const first = server.stop();
    const second = server.stop();
    assert.equal(first, second);
    await assert.rejects(first, /close failed/);
    await assert.rejects(server.stop(), /close failed/);
    assert.equal(attempts, 1);
});

test('request admission stops before shutdown listeners run', async () => {
    const {EventEmitter} = await import('node:events');
    const native = /** @type {*} */ (new EventEmitter());
    native.listen = () => queueMicrotask(() => native.emit('listening'));
    /** @type {(() => void)|undefined} */
    let finishClose;
    native.close = (/** @type {() => void} */ cb) => { finishClose = cb; };
    let handled = 0;
    let status = 0;
    const response = {writeHead: (/** @type {number} */ value) => { status = value; }, end() {}};
    const server = new Server({http: /** @type {*} */ ({createServer: () => native}), http2,
        config: /** @type {*} */ ({port: 0, type: 'http', shutdownTimeout: 500}),
        logger: /** @type {*} */ ({forSource: () => ({info() {}, error() {}, warn() {}})}),
        pipelineEngine: /** @type {*} */ ({lockHandlers() {}, handleRequest() { handled++; }}),
        SERVER_TYPE: /** @type {*} */ ({HTTP: 'http', HTTP2: 'http2', HTTPS: 'https'}),
        lifecycle: {beginShutdown: () => native.emit('request', {}, response)}});
    await server.start();
    const stopping = server.stop();
    assert.equal(status, 503);
    assert.equal(handled, 0);
    finishClose?.();
    await stopping;
});
