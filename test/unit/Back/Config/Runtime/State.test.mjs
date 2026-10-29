import {test} from 'node:test';
import assert from 'node:assert/strict';
import State from '../../../../../src/Back/Config/Runtime/State.mjs';

const create = (/** @type {object} */ values = {}) => new State({reader: /** @type {*} */ ({get: () => values})});

test('failed configuration is atomic and first values win', () => {
    const state = create({PORT: 'invalid', TLS: {cert: 'cfg'}, TLS_KEY: 'flat'});
    state.configure({port: 12, tls: {key: 'code'}});
    assert.throws(() => state.configure({host: 'not-applied', port: '12x'}));
    state.freeze();
    assert.equal(state.runtime.host, '127.0.0.1');
    assert.equal(state.runtime.port, 12);
    assert.equal(state.tls.key, 'code');
    assert.equal(state.tls.cert, 'cfg');
});

test('failed aggregate publication leaves both facades unreadable until corrected', () => {
    const state = create();
    state.configure({type: 'https'});
    assert.throws(() => state.freeze(), /TLS/);
    assert.throws(() => state.tls.key, /not initialized/);
    state.configure({tls: {key: 'key', cert: 'cert'}});
    assert.equal(state.freeze(), state.runtime);
    assert.equal(state.runtime.tls, state.tls);
    assert.throws(() => state.reset(), /frozen/);
});

test('transport options use atomic first writes and detached nested snapshots', () => {
    const state = create();
    const options = /** @type {*} */ ({http: {maxHeaderSize: 8192}, http2: {settings: {maxConcurrentStreams: 11}, opaque: Buffer.from('abc')}});
    state.configureTransport(options);
    options.http.maxHeaderSize = 99;
    options.http2.settings.maxConcurrentStreams = 99;
    options.http2.opaque[0] = 0;
    state.configureTransport(/** @type {*} */ ({http: {maxHeaderSize: 2048, headersTimeout: 10000}}));
    assert.throws(() => state.configureTransport(/** @type {*} */ ({http: {requestTimeout: 1}, https: {key: 'blocked'}})), /Reserved/);
    state.freeze();
    const first = /** @type {*} */ (state.runtime.transport);
    assert.equal(first.http.maxHeaderSize, 8192);
    assert.equal(first.http.headersTimeout, 10000);
    assert.equal(first.http.requestTimeout, undefined);
    assert.equal(first.http2.settings.maxConcurrentStreams, 11);
    assert.equal(first.http2.opaque.toString(), 'abc');
    first.http.maxHeaderSize = 1;
    first.http2.opaque[0] = 0;
    const second = /** @type {*} */ (state.runtime.transport);
    assert.equal(second.http.maxHeaderSize, 8192);
    assert.equal(second.http2.opaque.toString(), 'abc');
    assert.throws(() => state.configureTransport({}), /frozen/);
});

test('transport rejects cycles, accessors and unsupported instances before mutation', () => {
    const state = create();
    const cycle = /** @type {*} */ ({});
    cycle.child = cycle;
    for (const invalid of [{http: {bad: cycle}}, {http: {bad: new Date()}}, {http: Object.defineProperty({}, 'bad', {enumerable: true, get() { throw new Error('executed'); }})}]) {
        assert.throws(() => state.configureTransport(/** @type {*} */ (invalid)), /transport option/i);
    }
    state.configureTransport({http: {maxHeaderSize: 9000}});
    state.reset();
    state.freeze();
    assert.deepEqual(state.runtime.transport, {});
});

test('failed TLS commit keeps transport draft for correction', () => {
    const state = create();
    state.configure({type: 'https'});
    state.configureTransport({https: {maxHeaderListPairs: 25}});
    assert.throws(() => state.freeze(), /TLS/);
    state.configure({tls: {key: 'key', cert: 'cert'}});
    state.freeze();
    assert.equal(state.runtime.transport?.https?.maxHeaderListPairs, 25);
});

test('transport option sets validate all entries and preserve callable identity', () => {
    const state = create();
    const factory = () => 'owned';
    state.configureTransport(/** @type {*} */ ({http: {custom: factory, nested: {values: [1, 2]}}}));
    assert.throws(() => state.configureTransport(/** @type {*} */ ({http: {custom: factory}, http2: {settings: {nested: new Date()}}})), /Unsupported/);
    assert.throws(() => state.configureTransport(/** @type {*} */ ({https: {allowHTTP1: false}})), /Reserved/);
    assert.throws(() => state.configureTransport(/** @type {*} */ ({unknown: {}})), /Unknown/);
    state.freeze();
    const published = /** @type {*} */ (state.runtime.transport);
    assert.equal(published.http.custom, factory);
    published.http.nested.values.push(3);
    assert.deepEqual(/** @type {*} */ (state.runtime.transport).http.nested.values, [1, 2]);
    assert.equal(published.http2, undefined);
});

test('hardened facades preserve atomic publication and first write of nested options', () => {
    const state = create();
    Object.freeze(state.runtime);
    Object.freeze(state.tls);
    state.configureTransport({http2: {settings: {maxConcurrentStreams: 5}}});
    state.configureTransport({http2: {settings: {maxConcurrentStreams: 8, enablePush: false}}});
    state.freeze();
    assert.deepEqual(state.runtime.transport?.http2?.settings, {maxConcurrentStreams: 5});
});
