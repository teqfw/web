import {test} from 'node:test';
import assert from 'node:assert/strict';
import Wrapper, {Factory} from '../../../../../src/Back/Config/Runtime/Tls.mjs';

test('TLS wrapper and factory delegate to the shared transaction', () => {
    /** @type {unknown[]} */
    const calls = [];
    const tls = {key: 'key'};
    const state = /** @type {*} */ ({tls, configure: (/** @type {*} */ value) => calls.push(value), reset: () => calls.push('reset'), freeze: () => calls.push('freeze')});
    assert.equal(/** @type {*} */ (new Wrapper({state})), tls);
    const factory = new Factory({state});
    factory.configure({key: 'key'});
    factory.reset();
    assert.equal(factory.freeze(), tls);
    assert.deepEqual(calls, [{tls: {key: 'key'}}, 'reset', 'freeze']);
});
