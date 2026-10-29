import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import TeqFw_Web_Back_Handler_Static_A_Resolver from '../../../../../../src/Back/Handler/Static/A/Resolver.mjs';

describe('TeqFw_Web_Back_Handler_Static_A_Resolver', () => {
    test('resolves allowed path', async () => {
        /** @type {TeqFw_Web_Back_Handler_Static_A_Resolver} */
        const resolver = new TeqFw_Web_Back_Handler_Static_A_Resolver({path});

        const { resolve } = await import('node:path');
        const config = {
            root: resolve('/root'),
            prefix: '/p/',
            allow: { pkg: ['a.txt'] },
            defaults: []
        };

        const fsPath = resolver.resolve(config, 'pkg/a.txt');
        assert.strictEqual(fsPath, resolve('/root/pkg/a.txt'));
    });

    test('returns null for disallowed path', async () => {
        /** @type {TeqFw_Web_Back_Handler_Static_A_Resolver} */
        const resolver = new TeqFw_Web_Back_Handler_Static_A_Resolver({path});

        const { resolve } = await import('node:path');
        const config = {
            root: resolve('/root'),
            prefix: '/p/',
            allow: { pkg: ['a.txt'] },
            defaults: []
        };

        const result = resolver.resolve(config, 'pkg/b.txt');
        assert.strictEqual(result, null);
    });

    test('throws on path traversal attempts', async () => {
        /** @type {TeqFw_Web_Back_Handler_Static_A_Resolver} */
        const resolver = new TeqFw_Web_Back_Handler_Static_A_Resolver({path});

        const { resolve } = await import('node:path');
        const config = {
            root: resolve('/root'),
            prefix: '/p/',
            allow: { pkg: ['a.txt'] },
            defaults: []
        };

        assert.equal(resolver.resolve(config, '../x'), null);
    });

    test('throws on absolute rel paths', async () => {
        /** @type {TeqFw_Web_Back_Handler_Static_A_Resolver} */
        const resolver = new TeqFw_Web_Back_Handler_Static_A_Resolver({path});

        const { resolve } = await import('node:path');
        const config = {
            root: resolve('/root'),
            prefix: '/p/',
            allow: { pkg: ['a.txt'] },
            defaults: []
        };

        assert.equal(resolver.resolve(config, '/etc/passwd'), null);
    });
});
