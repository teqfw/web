import {test} from 'node:test';
import assert from 'node:assert/strict';
import State from '../../src/Back/Config/Runtime/State.mjs';
import Runtime, {Factory} from '../../src/Back/Config/Runtime.mjs';
import Tls, {Factory as TlsFactory} from '../../src/Back/Config/Runtime/Tls.mjs';

function make(values = {}) {
    const state = new State({reader: /** @type {*} */ ({get: () => values})});
    return {runtime: /** @type {TeqFw_Web_Back_Config_Runtime} */ (/** @type {*} */ (new Runtime({state}))), tls: /** @type {TeqFw_Web_Back_Config_Runtime_Tls} */ (/** @type {*} */ (new Tls({state}))), factory: new Factory({state}), tlsFactory: new TlsFactory({state})};
}

test('publishes defaults and keeps container state isolated', () => {
    const a = make();
    const b = make({PORT: '1234'});
    assert.throws(() => a.runtime.port, /not initialized/);
    Object.freeze(a.runtime);
    Object.freeze(a.tls);
    a.factory.freeze();
    b.factory.freeze();
    assert.equal(a.runtime.host, '127.0.0.1');
    assert.equal(a.runtime.port, 3000);
    assert.equal(a.runtime.shutdownTimeout, 5000);
    assert.equal(b.runtime.port, 1234);
    assert.throws(() => a.factory.reset(), /frozen/);
});

test('validates calls atomically and projects configuration by precedence', () => {
    const a = make({PORT: 'invalid', TLS: {cert: 'typed'}, TLS_CERT: 'flat', TLS_KEY: 'cfg'});
    a.factory.configure({port: 42, tls: {key: 'code'}});
    assert.throws(() => a.factory.configure({host: 'changed', port: '42junk'}));
    a.factory.freeze();
    assert.equal(a.runtime.host, '127.0.0.1');
    assert.equal(a.runtime.port, 42);
    assert.equal(a.runtime.tls?.cert, 'typed');
    assert.equal(a.runtime.tls?.key, 'code');
    assert.equal(a.factory.freeze(), a.runtime);
});

test('failed TLS publication is recoverable and reset clears the full draft', () => {
    const a = make();
    a.factory.configure({type: 'https', port: 0});
    assert.throws(() => a.tlsFactory.freeze(), /TLS/);
    assert.throws(() => a.tls.key, /not initialized/);
    a.tlsFactory.configure({key: 'key', cert: 'cert'});
    assert.equal(a.tlsFactory.freeze(), a.tls);
    assert.equal(a.runtime.port, 0);
    const b = make();
    b.factory.configure({port: 7, tls: {key: 'key'}});
    b.tlsFactory.reset();
    b.factory.freeze();
    assert.equal(b.runtime.port, 3000);
    assert.equal(b.tls.key, undefined);
});

test('rejects malformed numbers, bounds and null without publishing', () => {
    for (const value of ['1x', '', '1e2', '0x10', -1, 65536, null, true]) {
        const a = make();
        assert.throws(() => a.factory.configure({port: value}));
        assert.throws(() => a.runtime.port, /not initialized/);
    }
    const a = make({SHUTDOWN_TIMEOUT: ' 0 '});
    a.factory.freeze();
    assert.equal(a.runtime.shutdownTimeout, 0);
});
