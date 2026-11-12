import {describe, test} from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import Config from '../../src/Back/Handler/Static/A/Config.mjs';
import Registry from '../../src/Back/Handler/Static/A/Registry.mjs';
import Static from '../../src/Back/Handler/Static.mjs';

function createRegistry() {
    return new Registry({configFactory: new Config({path})});
}

describe('TeqFw_Web_Back_Handler_Static_A_Registry', () => {
    test('registers independent sources and matches the longest prefix', () => {
        const registry = createRegistry();
        registry.addConfigs(/** @type {*} */ ([{root: '/a', prefix: '/p'}]));
        registry.addConfigs(/** @type {*} */ ([{root: '/b', prefix: '/p/s/'}]));
        assert.equal(registry.find('/p/s/file.txt')?.config.root, '/b');
        assert.equal(registry.find('/p/file.txt')?.config.root, '/a');
        assert.equal(registry.find('/other'), null);
    });

    test('rejects normalized duplicates within a batch without registering any source', () => {
        const registry = createRegistry();
        registry.addConfigs(/** @type {*} */ ([{root: '/existing', prefix: '/existing'}]));
        assert.throws(() => registry.addConfigs(/** @type {*} */ ([
            {root: '/new', prefix: '/new'},
            {root: '/a', prefix: '/foo'},
            {root: '/b', prefix: '/foo/'},
        ])), /Duplicate static source prefix: \/foo\//);
        assert.equal(registry.find('/new/file'), null);
        assert.equal(registry.find('/foo/file'), null);
        assert.equal(registry.find('/existing/file')?.config.root, '/existing');
    });

    test('rejects duplicates across calls without changing existing or registering new sources', () => {
        const registry = createRegistry();
        registry.addConfigs(/** @type {*} */ ([{root: '/original', prefix: '/foo'}]));
        assert.throws(() => registry.addConfigs(/** @type {*} */ ([
            {root: '/new', prefix: '/new'},
            {root: '/replacement', prefix: '/foo/'},
        ])), /Duplicate static source prefix: \/foo\//);
        assert.equal(registry.find('/new/file'), null);
        assert.equal(registry.find('/foo/file')?.config.root, '/original');
    });

    test('invalid source leaves the entire batch and prior registrations unchanged', () => {
        const registry = createRegistry();
        registry.addConfigs(/** @type {*} */ ([{root: '/existing', prefix: '/existing'}]));
        assert.throws(() => registry.addConfigs(/** @type {*} */ ([
            {root: '/new', prefix: '/new'},
            /** @type {*} */ ({root: 42, prefix: '/invalid'}),
        ])), /Field 'root' must be a string/);
        assert.equal(registry.find('/new/file'), null);
        assert.equal(registry.find('/existing/file')?.config.root, '/existing');
    });
});

test('Static.init propagates duplicate registration errors', async () => {
    const registry = createRegistry();
    const handler = new Static({registry, fileService: /** @type {*} */ ({}), respond: /** @type {*} */ ({}),
        dtoInfoFactory: /** @type {*} */ ({create: (/** @type {*} */ info) => info}), STAGE: /** @type {*} */ ({PROCESS: 'PROCESS'})});
    await handler.init({sources: [/** @type {*} */ ({root: '/a', prefix: '/foo'})]});
    await assert.rejects(handler.init({sources: [/** @type {*} */ ({root: '/b', prefix: '/foo/'})]}),
        /Duplicate static source prefix: \/foo\//);
    assert.equal(registry.find('/foo/file')?.config.root, '/a');
});
