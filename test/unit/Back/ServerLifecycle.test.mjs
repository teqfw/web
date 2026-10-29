import {test} from 'node:test';
import assert from 'node:assert/strict';
import Lifecycle, {Controller} from '../../../src/Back/ServerLifecycle.mjs';

test('observer exposes a read-only signal and the controller activates it once', () => {
    const state = {controller: new AbortController()};
    const observer = new Lifecycle({state});
    const control = new Controller({state});
    let events = 0;
    observer.shutdownSignal.addEventListener('abort', () => events++);
    Object.freeze(observer);
    Object.freeze(control);
    control.beginShutdown();
    control.beginShutdown();
    assert.equal(observer.shutdownSignal.aborted, true);
    assert.equal(events, 1);
    assert.throws(() => { observer.shutdownSignal = new AbortController().signal; });
});
