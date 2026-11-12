import {describe, test} from 'node:test';
import assert from 'node:assert/strict';
import Registry from '../../../../../../src/Back/Handler/Static/A/Registry.mjs';

function createRegistry() {
    return new Registry({configFactory: /** @type {*} */ ({create: (/** @type {*} */ dto) => {
        if (typeof dto.root !== 'string') throw new Error("Field 'root' must be a string");
        return {...dto, prefix: dto.prefix.endsWith('/') ? dto.prefix : `${dto.prefix}/`};
    }})});
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
