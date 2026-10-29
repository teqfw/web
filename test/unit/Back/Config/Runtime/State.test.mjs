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
