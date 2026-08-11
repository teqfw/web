import {describe, test} from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import TeqFw_Web_Back_Handler_Static_A_Config from '../../../../../../src/Back/Handler/Static/A/Config.mjs';

describe('TeqFw_Web_Back_Handler_Static_A_Config', () => {
    test('normalizes root, prefix, allow and defaults', async () => {
        /** @type {TeqFw_Web_Back_Handler_Static_A_Config} */
        const factory = new TeqFw_Web_Back_Handler_Static_A_Config({path});

        const dto = {
            root: './r',
            prefix: '/p',
            allow: {'.': ['.']},
            defaults: []
        };
        const cfg = factory.create(dto);

        // root is resolved via node:path from the container
        const {resolve} = await import('node:path');
        assert.strictEqual(cfg.root, resolve('./r'));

        // prefix is normalized to always end with a slash
        assert.strictEqual(cfg.prefix, '/p/');

        // allowed extensions are preserved
        assert.deepStrictEqual(cfg.allow, {'.': ['.']});

        // defaults fallback to built-in list when empty
        assert.deepStrictEqual(
            cfg.defaults,
            ['index.html', 'index.htm', 'index.txt']
        );
    });

    test('throws on invalid data', async () => {
        /** @type {TeqFw_Web_Back_Handler_Static_A_Config} */
        const factory = new TeqFw_Web_Back_Handler_Static_A_Config({path});

        // missing root should throw an error about root
        assert.throws(
            () => factory.create(/** @type {*} */ ({prefix: '/'})),
            /Field 'root' must be a string/
        );

        // non-string prefix should throw an error about prefix
        assert.throws(
            () => factory.create(/** @type {*} */ ({root: 'a', prefix: 5})),
            /Field 'prefix' must be a string/
        );
    });
});
