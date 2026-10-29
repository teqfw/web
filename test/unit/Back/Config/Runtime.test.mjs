import {test} from 'node:test';
import assert from 'node:assert/strict';
import Wrapper, {Factory} from '../../../../src/Back/Config/Runtime.mjs';

test('wrapper and factory delegate to the supplied state', () => {
    /** @type {unknown[]} */
    const calls = [];
    const runtime = {host: '127.0.0.1'};
    const state = /** @type {*} */ ({runtime, configure: (/** @type {*} */ value) => calls.push(value), reset: () => calls.push('reset'), freeze: () => runtime});
    assert.equal(/** @type {*} */ (new Wrapper({state})), runtime);
    const factory = new Factory({state});
    factory.configure({port: 1});
    factory.reset();
    assert.equal(factory.freeze(), runtime);
    assert.deepEqual(calls, [{port: 1}, 'reset']);
});
