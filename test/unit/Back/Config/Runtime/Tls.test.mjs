import {describe, test} from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

async function loadTlsModule() {
    const href = pathToFileURL(path.resolve(import.meta.dirname, '../../../../../src/Back/Config/Runtime/Tls.mjs')).href;
    return import(`${href}?case=${Math.random()}`);
}

describe('TeqFw_Web_Back_Config_Runtime_Tls', () => {
    test('keeps first write wins and freezes configuration', async () => {
        const {default: RuntimeTls, Factory} = await loadTlsModule();
        const {default: Cast} = await import('../../../../../src/Back/Helper/Cast.mjs');

        const tls = new RuntimeTls();
        const factory = new Factory({cast: new Cast()});
        assert.throws(() => tls.key, /not initialized/);
        Object.freeze(tls);
        assert.equal(Object.isFrozen(tls), true);

        factory.configure({key: 'key-1', cert: 'cert-1'});
        factory.configure({key: 'key-2', cert: 'cert-2', ca: 'ca-1'});
        factory.freeze();

        assert.equal(tls.key, 'key-1');
        assert.equal(tls.cert, 'cert-1');
        assert.equal(tls.ca, 'ca-1');
        assert.throws(() => {
            tls.key = 'next';
        }, /immutable/);
        assert.throws(() => factory.configure({key: 'next'}), /frozen/);
        assert.equal(factory.freeze(), tls);
    });
});
