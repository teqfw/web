import {describe, test} from 'node:test';
import assert from 'node:assert/strict';
import TeqFw_Web_Back_Helper_Mime from '../../../../src/Back/Helper/Mime.mjs';

describe('TeqFw_Web_Back_Helper_Mime', () => {
    test('returns mapped mime type by extension', () => {
        const mime = new TeqFw_Web_Back_Helper_Mime();
        assert.strictEqual(mime.getByExt('.html'), 'text/html');
        assert.strictEqual(mime.getByExt('.MJS'), 'application/javascript');
    });

    test('returns octet-stream for unknown extension', () => {
        const mime = new TeqFw_Web_Back_Helper_Mime();
        assert.strictEqual(mime.getByExt('.unknown-ext'), 'application/octet-stream');
    });
});
