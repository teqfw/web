import {test} from 'node:test';
import assert from 'node:assert/strict';
import State from '../../../../src/Back/ServerLifecycle/State.mjs';

test('each state owns an independent abort controller', () => {
    const first = new State();
    const second = new State();
    first.controller.abort();
    assert.equal(first.controller.signal.aborted, true);
    assert.equal(second.controller.signal.aborted, false);
});
