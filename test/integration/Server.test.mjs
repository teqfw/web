import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import https from 'node:https';
import * as http2 from 'node:http2';
import {once} from 'node:events';
import Container from '@teqfw/di';
import NamespaceRegistry from '@teqfw/di/node/registry/namespace';

/** @param {import('node:test').TestContext} t @param {number} timeout @param {string} [type] @param {boolean} [deferFreeze] */
async function setup(t, timeout, type = 'http', deferFreeze = false) {
    const container = new Container();
    const registry = new NamespaceRegistry({fs: /** @type {*} */ (fs), path, appRoot: path.resolve(import.meta.dirname, '../..')});
    for (const {prefix, dirAbs, ext} of await registry.build()) container.addNamespaceRoot(prefix, dirAbs, ext);
    container.enableTestMode();
    /** @type {((signal: 'SIGTERM') => void)|undefined} */
    let notifySignal;
    container.register('TeqFw_Cli_Adapter_Signal$', {subscribe: (/** @type {(signal: 'SIGTERM') => void} */ fn) => { notifySignal = fn; return () => {}; }});
    const loader = await container.get('TeqFw_Cfg_Loader$');
    const source = await container.get('TeqFw_Cfg_Source_Object$');
    await loader.load([source.create({})]);
    const factory = await container.get('TeqFw_Web_Back_Config_Runtime__Factory$');
    const tls = type === 'https' ? {key: await fs.readFile(path.resolve(import.meta.dirname, '../certs/key.pem'), 'utf8'), cert: await fs.readFile(path.resolve(import.meta.dirname, '../certs/cert.pem'), 'utf8')} : undefined;
    factory.configure({port: 0, type, shutdownTimeout: timeout, tls});
    if (!deferFreeze) factory.freeze();
    const lifecycle = await container.get('TeqFw_Web_Back_ServerLifecycle$');
    const pipeline = await container.get('TeqFw_Web_Back_PipelineEngine$');
    const stage = await container.get('TeqFw_Web_Back_Enum_Stage$');
    const server = await container.get('TeqFw_Web_Back_Server$');
    t.after(async () => {
        const instance = server.getInstance();
        if (instance && 'closeAllConnections' in instance) instance.closeAllConnections();
        await server.stop();
    });
    const host = await container.get('TeqFw_Cli_Host$');
    const command = await container.get('TeqFw_Web_Back_Cli_Command_Start$');
    return {server, lifecycle, pipeline, stage, host, command, factory, signal: () => notifySignal?.('SIGTERM')};
}

test('live SSE receives shutdown signal and closes before the deadline', {timeout: 5000}, async (t) => {
    const {server, lifecycle, pipeline, stage} = await setup(t, 1200);
    pipeline.addHandler({getRegistrationInfo: () => ({name: 'sse', stage: stage.PROCESS}), handle: async (/** @type {TeqFw_Web_Back_Dto_RequestContext} */ ctx) => {
        const response = /** @type {*} */ (ctx.response);
        response.writeHead(200, {'content-type': 'text/event-stream'});
        response.write('data: ready\n\n');
        ctx.completed = true;
        const finish = () => response.end('data: shutdown\n\n');
        lifecycle.shutdownSignal.addEventListener('abort', finish, {once: true});
        response.once('close', () => lifecycle.shutdownSignal.removeEventListener('abort', finish));
    }});
    await server.start();
    const address = /** @type {import('node:net').AddressInfo} */ (server.getInstance().address());
    const request = http.get({host: '127.0.0.1', port: address.port});
    const [response] = /** @type {[import('node:http').IncomingMessage]} */ (await once(request, 'response'));
    let body = '';
    response.on('data', chunk => { body += chunk; });
    const ended = once(response, 'end');
    const started = performance.now();
    await Promise.all([server.stop(), ended]);
    assert.ok(performance.now() - started < 1000, 'cooperative response should close before the grace deadline');
    assert.match(body, /shutdown/);
    assert.equal(lifecycle.shutdownSignal.aborted, true);
});

test('non-cooperative SSE is forcibly disconnected after timeout', {timeout: 5000}, async (t) => {
    const {server, pipeline, stage} = await setup(t, 40);
    pipeline.addHandler({getRegistrationInfo: () => ({name: 'sse', stage: stage.PROCESS}), handle: async (/** @type {TeqFw_Web_Back_Dto_RequestContext} */ ctx) => {
        const response = /** @type {*} */ (ctx.response);
        response.writeHead(200, {'content-type': 'text/event-stream'});
        response.write('data: open\n\n');
        ctx.completed = true;
    }});
    await server.start();
    const address = /** @type {import('node:net').AddressInfo} */ (server.getInstance().address());
    const request = http.get({host: '127.0.0.1', port: address.port});
    const [response] = /** @type {[import('node:http').IncomingMessage]} */ (await once(request, 'response'));
    response.on('error', () => {});
    response.resume();
    const closed = new Promise(resolve => response.once('close', resolve));
    const started = performance.now();
    await Promise.all([server.stop(), closed]);
    assert.ok(performance.now() - started >= 25, 'active stream must receive a grace period');
    assert.equal(response.complete, false);
});


test('CLI Host stops SSE before plugin shutdown', {timeout: 5000}, async (t) => {
    const {server, lifecycle, pipeline, stage, host, command, signal} = await setup(t, 300);
    /** @type {string[]} */
    const events = [];
    pipeline.addHandler({getRegistrationInfo: () => ({name: 'cli-sse', stage: stage.PROCESS}), handle: async (/** @type {TeqFw_Web_Back_Dto_RequestContext} */ ctx) => {
        const res = /** @type {*} */ (ctx.response);
        res.writeHead(200, {'content-type': 'text/event-stream'});
        res.write('data: ready\n\n');
        ctx.completed = true;
        lifecycle.shutdownSignal.addEventListener('abort', () => { events.push('signal'); res.end(); }, {once: true});
    }});
    const run = host.open({argv: [], version: 'test', commands: [], launch: {}});
    await run.start({onStartup: async () => {}, onShutdown: async () => { events.push('plugin'); assert.equal(server.getInstance(), undefined); }});
    const executing = run.execute({args: [], options: {}}, command);
    const deadline = performance.now() + 2000;
    while (!server.getInstance()?.listening) {
        if (performance.now() > deadline) throw new Error('CLI server did not become ready');
        await new Promise(resolve => setTimeout(resolve, 1));
    }
    const address = /** @type {import('node:net').AddressInfo} */ (server.getInstance().address());
    const req = http.get({host: '127.0.0.1', port: address.port});
    const [res] = /** @type {[import('node:http').IncomingMessage]} */ (await once(req, 'response'));
    res.resume();
    signal();
    await executing;
    assert.equal(await run.close(), 143);
    assert.deepEqual(events, ['signal', 'plugin']);
});


test('HTTP/2 shutdown closes an uncooperative stream and session', {timeout: 5000}, async (t) => {
    const {server, pipeline, stage} = await setup(t, 40, 'http2');
    pipeline.addHandler({getRegistrationInfo: () => ({name: 'h2-sse', stage: stage.PROCESS}), handle: async (/** @type {TeqFw_Web_Back_Dto_RequestContext} */ ctx) => {
        const res = /** @type {*} */ (ctx.response);
        res.writeHead(200, {'content-type': 'text/event-stream'});
        res.write('data: open\n\n');
        ctx.completed = true;
    }});
    await server.start();
    const address = /** @type {import('node:net').AddressInfo} */ (server.getInstance().address());
    const client = http2.connect(`http://127.0.0.1:${address.port}`);
    t.after(() => client.destroy());
    client.on('error', () => {});
    const stream = client.request({':path': '/'});
    stream.on('error', () => {});
    stream.resume();
    await once(stream, 'response');
    const closed = new Promise(resolve => client.once('close', resolve));
    await Promise.all([server.stop(), closed]);
    assert.equal(client.closed || client.destroyed, true);
});

test('configuration and lifecycle are isolated between DI containers', {timeout: 5000}, async (t) => {
    const first = await setup(t, 10);
    const second = await setup(t, 20);
    assert.notEqual(first.lifecycle.shutdownSignal, second.lifecycle.shutdownSignal);
    await first.server.stop();
    assert.equal(first.lifecycle.shutdownSignal.aborted, true);
    assert.equal(second.lifecycle.shutdownSignal.aborted, false);
    await second.server.stop();
});

test('zero timeout notifies subscribers then forces an open HTTP stream', {timeout: 5000}, async (t) => {
    const {server, lifecycle, pipeline, stage} = await setup(t, 0);
    let notified = false;
    pipeline.addHandler({getRegistrationInfo: () => ({name: 'zero', stage: stage.PROCESS}), handle: async (/** @type {TeqFw_Web_Back_Dto_RequestContext} */ ctx) => {
        const res = /** @type {*} */ (ctx.response);
        res.writeHead(200);
        res.write('open');
        ctx.completed = true;
        lifecycle.shutdownSignal.addEventListener('abort', () => { notified = true; }, {once: true});
    }});
    await server.start();
    const address = /** @type {import('node:net').AddressInfo} */ (server.getInstance().address());
    const req = http.get({host: '127.0.0.1', port: address.port});
    const [res] = /** @type {[import('node:http').IncomingMessage]} */ (await once(req, 'response'));
    res.on('error', () => {});
    res.resume();
    const closed = new Promise(resolve => res.once('close', resolve));
    await Promise.all([server.stop(), closed]);
    assert.equal(notified, true);
    assert.equal(res.complete, false);
});


test('secure transport drains HTTP/1.1 and HTTP/2 streams', {timeout: 5000}, async (t) => {
    const {server, lifecycle, pipeline, stage} = await setup(t, 400, 'https');
    pipeline.addHandler({getRegistrationInfo: () => ({name: 'secure-sse', stage: stage.PROCESS}), handle: async (/** @type {TeqFw_Web_Back_Dto_RequestContext} */ ctx) => {
        const res = /** @type {*} */ (ctx.response);
        res.writeHead(200, {'content-type': 'text/event-stream'});
        res.write('data: ready\n\n');
        ctx.completed = true;
        lifecycle.shutdownSignal.addEventListener('abort', () => res.end(), {once: true});
    }});
    await server.start();
    const address = /** @type {import('node:net').AddressInfo} */ (server.getInstance().address());
    const req = https.get({host: '127.0.0.1', port: address.port, rejectUnauthorized: false});
    const [res] = /** @type {[import('node:http').IncomingMessage]} */ (await once(req, 'response'));
    res.resume();
    const client = http2.connect(`https://127.0.0.1:${address.port}`, {rejectUnauthorized: false, servername: 'localhost'});
    t.after(() => client.destroy());
    client.on('error', () => {});
    const stream = client.request({':path': '/'});
    stream.on('error', () => {});
    stream.resume();
    await once(stream, 'response');
    const clientClosed = new Promise(resolve => client.once('close', resolve));
    const responseEnded = once(res, 'end');
    await Promise.all([server.stop(), clientClosed, responseEnded]);
});

test('HTTP/2 streams submitted during drain never enter the pipeline', {timeout: 5000}, async t => {
    const {server, pipeline, stage} = await setup(t, 150, 'http2');
    let requests = 0;
    pipeline.addHandler({getRegistrationInfo: () => ({name: 'admission', stage: stage.PROCESS}), handle: async (/** @type {TeqFw_Web_Back_Dto_RequestContext} */ ctx) => {
        requests++;
        const res = /** @type {*} */ (ctx.response);
        res.writeHead(200);
        res.write('open');
        ctx.completed = true;
    }});
    await server.start();
    const address = /** @type {import('node:net').AddressInfo} */ (server.getInstance().address());
    const client = http2.connect(`http://127.0.0.1:${address.port}`);
    client.on('error', () => {});
    t.after(() => client.destroy());
    const first = client.request({':path': '/first'});
    first.on('error', () => {});
    first.resume();
    await once(first, 'response');
    const closed = new Promise(resolve => client.once('close', resolve));
    const stopping = server.stop();
    try {
        const late = client.request({':path': '/late'});
        late.on('error', () => {});
        late.resume();
    } catch (error) {
        assert.match(String(error), /GOAWAY|closed|destroyed/i);
    }
    await Promise.all([stopping, closed]);
    assert.equal(requests, 1);
});

test('zero timeout aborts open secure HTTP/1 and HTTP/2 streams after notification', {timeout: 5000}, async t => {
    const {server, lifecycle, pipeline, stage} = await setup(t, 0, 'https');
    let notifications = 0;
    lifecycle.shutdownSignal.addEventListener('abort', () => { notifications++; });
    pipeline.addHandler({getRegistrationInfo: () => ({name: 'zero-secure', stage: stage.PROCESS}), handle: async (/** @type {TeqFw_Web_Back_Dto_RequestContext} */ ctx) => {
        const res = /** @type {*} */ (ctx.response);
        res.writeHead(200);
        res.write('open');
        ctx.completed = true;
    }});
    await server.start();
    const address = /** @type {import('node:net').AddressInfo} */ (server.getInstance().address());
    const req = https.get({host: '127.0.0.1', port: address.port, rejectUnauthorized: false});
    t.after(() => req.destroy());
    const [response] = /** @type {[import('node:http').IncomingMessage]} */ (await once(req, 'response'));
    response.on('error', () => {});
    response.resume();
    const h2 = http2.connect(`https://127.0.0.1:${address.port}`, {rejectUnauthorized: false, servername: 'localhost'});
    h2.on('error', () => {});
    t.after(() => h2.destroy());
    const stream = h2.request({':path': '/'});
    stream.on('error', () => {});
    stream.resume();
    await once(stream, 'response');
    const httpClosed = new Promise(resolve => response.once('close', resolve));
    const h2Closed = new Promise(resolve => h2.once('close', resolve));
    await Promise.all([server.stop(), httpClosed, h2Closed]);
    assert.equal(notifications, 1);
    assert.equal(response.complete, false);
    assert.ok(h2.destroyed || h2.closed);
});

test('zero timeout closes an open cleartext HTTP/2 session after notification', {timeout: 5000}, async t => {
    const {server, lifecycle, pipeline, stage} = await setup(t, 0, 'http2');
    let notifications = 0;
    lifecycle.shutdownSignal.addEventListener('abort', () => { notifications++; });
    pipeline.addHandler({getRegistrationInfo: () => ({name: 'zero-h2', stage: stage.PROCESS}), handle: async (/** @type {TeqFw_Web_Back_Dto_RequestContext} */ ctx) => {
        const res = /** @type {*} */ (ctx.response);
        res.writeHead(200);
        res.write('open');
        ctx.completed = true;
    }});
    await server.start();
    const address = /** @type {import('node:net').AddressInfo} */ (server.getInstance().address());
    const client = http2.connect(`http://127.0.0.1:${address.port}`);
    client.on('error', () => {});
    t.after(() => client.destroy());
    const stream = client.request({':path': '/'});
    stream.on('error', () => {});
    stream.resume();
    await once(stream, 'response');
    const closed = new Promise(resolve => client.once('close', resolve));
    await Promise.all([server.stop(), closed]);
    assert.equal(notifications, 1);
    assert.ok(client.closed || client.destroyed);
});

test('CLI plugin configures HTTP parser before the standard command starts', {timeout: 5000}, async t => {
    const {server, host, command, factory, signal} = await setup(t, 50, 'http', true);
    const run = host.open({argv: [], version: 'test', commands: [], launch: {}});
    t.after(() => run.close());
    await run.start({onStartup: async () => factory.configureTransport({http: {maxHeaderSize: 1024, headersTimeout: 10000, requestTimeout: 10000}}), onShutdown: async () => {}});
    const execution = run.execute({args: [], options: {}}, command);
    const deadline = performance.now() + 2000;
    while (!server.getInstance()?.listening) {
        if (performance.now() > deadline) throw new Error('CLI server did not become ready');
        await new Promise(resolve => setTimeout(resolve, 1));
    }
    const instance = /** @type {import('node:http').Server} */ (server.getInstance());
    assert.equal(instance.headersTimeout, 10000);
    assert.equal(instance.requestTimeout, 10000);
    const address = /** @type {import('node:net').AddressInfo} */ (instance.address());
    const request = http.get({host: '127.0.0.1', port: address.port, headers: {'x-large': 'x'.repeat(1500)}});
    t.after(() => request.destroy());
    const [response] = /** @type {[import('node:http').IncomingMessage]} */ (await once(request, 'response'));
    assert.equal(response.statusCode, 431);
    response.resume();
    signal();
    await execution;
    assert.equal(await run.close(), 143);
});

for (const type of ['http2', 'https']) {
    test(`${type} applies its own HTTP/2 settings`, {timeout: 5000}, async t => {
        const {server, factory} = await setup(t, 50, type, true);
        factory.configureTransport({http: {maxHeaderSize: 2048}, http2: {settings: {maxConcurrentStreams: 7}}, https: {settings: {maxConcurrentStreams: 13}}});
        factory.freeze();
        await server.start();
        const address = /** @type {import('node:net').AddressInfo} */ (server.getInstance().address());
        if (type === 'https') {
            const request = https.get({host: '127.0.0.1', port: address.port, rejectUnauthorized: false});
            t.after(() => request.destroy());
            const [response] = /** @type {[import('node:http').IncomingMessage]} */ (await once(request, 'response'));
            assert.equal(response.httpVersion, '1.1');
            assert.equal(response.statusCode, 404);
            response.resume();
        }
        const client = http2.connect(`${type === 'https' ? 'https' : 'http'}://127.0.0.1:${address.port}`, type === 'https' ? {rejectUnauthorized: false, servername: 'localhost'} : {});
        client.on('error', () => {});
        t.after(() => client.destroy());
        const [settings] = /** @type {[import('node:http2').Settings]} */ (await once(client, 'remoteSettings'));
        assert.equal(settings.maxConcurrentStreams, type === 'https' ? 13 : 7);
        client.close();
        await server.stop();
    });
}

test('omitted HTTP options keep defaults from the current Node runtime', {timeout: 5000}, async t => {
    const {server} = await setup(t, 50);
    const baseline = http.createServer((_req, res) => res.end());
    await new Promise(resolve => baseline.listen(0, '127.0.0.1', () => resolve(undefined)));
    t.after(() => new Promise(resolve => baseline.close(() => resolve(undefined))));
    await server.start();
    const instance = /** @type {import('node:http').Server} */ (server.getInstance());
    const baselineAddress = /** @type {import('node:net').AddressInfo} */ (baseline.address());
    const actualAddress = /** @type {import('node:net').AddressInfo} */ (instance.address());
    for (const [port, expected] of [[baselineAddress.port, 200], [actualAddress.port, 404]]) {
        const req = http.get({host: '127.0.0.1', port, headers: {'x-large': 'x'.repeat(9000)}});
        const [res] = /** @type {[import('node:http').IncomingMessage]} */ (await once(req, 'response'));
        assert.equal(res.statusCode, expected);
        res.resume();
    }
    assert.equal(instance.headersTimeout, baseline.headersTimeout);
    assert.equal(instance.requestTimeout, baseline.requestTimeout);
    await server.stop();
});

test('invalid native values fail startup and preserve single-start semantics', {timeout: 5000}, async t => {
    const {server, factory, lifecycle} = await setup(t, 50, 'http', true);
    factory.configureTransport({http: {maxHeaderSize: -1}});
    factory.freeze();
    await assert.rejects(server.start(), /maxHeaderSize|range/i);
    assert.equal(lifecycle.shutdownSignal.aborted, true);
    await assert.rejects(server.start(), /once/);
});

test('native options are isolated in separate DI containers', {timeout: 5000}, async t => {
    const first = await setup(t, 50, 'http', true);
    const second = await setup(t, 50, 'http', true);
    first.factory.configureTransport({http: {headersTimeout: 1200}});
    second.factory.configureTransport({http: {headersTimeout: 1800}});
    first.factory.freeze();
    second.factory.freeze();
    await Promise.all([first.server.start(), second.server.start()]);
    assert.equal(/** @type {import('node:http').Server} */ (first.server.getInstance()).headersTimeout, 1200);
    assert.equal(/** @type {import('node:http').Server} */ (second.server.getInstance()).headersTimeout, 1800);
    await Promise.all([first.server.stop(), second.server.stop()]);
});
