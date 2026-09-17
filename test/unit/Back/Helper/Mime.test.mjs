import {describe, test} from 'node:test';
import assert from 'node:assert/strict';
import TeqFw_Web_Back_Helper_Mime from '../../../../src/Back/Helper/Mime.mjs';

describe('TeqFw_Web_Back_Helper_Mime', () => {
    test('returns built-in MIME types by extension', () => {
        const mime = new TeqFw_Web_Back_Helper_Mime();
        assert.strictEqual(mime.getByExt('.html'), 'text/html');
        assert.strictEqual(mime.getByExt('.MJS'), 'application/javascript');
    });

    test('includes modern web and document MIME types', () => {
        const mime = new TeqFw_Web_Back_Helper_Mime();
        const expected = {
            '.md': 'text/markdown',
            '.markdown': 'text/markdown',
            '.map': 'application/json',
            '.webmanifest': 'application/manifest+json',
            '.wasm': 'application/wasm',
            '.avif': 'image/avif',
            '.apng': 'image/apng',
            '.flac': 'audio/flac',
            '.opus': 'audio/opus',
            '.m4a': 'audio/mp4',
            '.m4v': 'video/mp4',
            '.mov': 'video/quicktime',
            '.mkv': 'video/x-matroska',
            '.rss': 'application/rss+xml',
            '.atom': 'application/atom+xml',
            '.yaml': 'application/yaml',
            '.yml': 'application/yaml',
        };

        for (const [extension, mimeType] of Object.entries(expected)) {
            assert.strictEqual(mime.getByExt(extension), mimeType);
        }
    });

    test('supports normalized, case-insensitive custom mappings', () => {
        const mime = new TeqFw_Web_Back_Helper_Mime();
        mime.addTypes({
            report: 'application/vnd.example.report',
        });

        assert.strictEqual(mime.getByExt('.REPORT'), 'application/vnd.example.report');
        assert.strictEqual(mime.getByExt('report'), 'application/vnd.example.report');
    });

    test('gives built-in mappings precedence over custom mappings', () => {
        const mime = new TeqFw_Web_Back_Helper_Mime();
        mime.addTypes({
            HTML: 'application/x-custom-html',
            md: 'application/x-custom-markdown',
        });

        assert.strictEqual(mime.getByExt('.html'), 'text/html');
        assert.strictEqual(mime.getByExt('.MD'), 'text/markdown');
    });

    test('copies custom mappings and does not share mutable state', () => {
        /** @type {Record<string, string>} */
        const customTypes = {'.report': 'application/vnd.example.report'};
        const mime = new TeqFw_Web_Back_Helper_Mime();
        mime.addTypes(customTypes);
        customTypes['.report'] = 'application/x-mutated';
        customTypes['.other'] = 'application/x-other';

        assert.strictEqual(mime.getByExt('.report'), 'application/vnd.example.report');
        assert.strictEqual(mime.getByExt('.other'), 'application/octet-stream');
    });

    test('rejects invalid custom mappings', () => {
        const mime = new TeqFw_Web_Back_Helper_Mime();
        assert.throws(() => mime.addTypes(/** @type {*} */ (null)), TypeError);
        assert.throws(() => mime.addTypes(/** @type {*} */ ([])), TypeError);
        assert.throws(() => mime.addTypes({'': 'text/plain'}), TypeError);
        assert.throws(() => mime.addTypes({'.report': 'invalid'}), TypeError);
        assert.throws(() => mime.addTypes(/** @type {*} */ ({'.report': 42})), TypeError);
        assert.throws(() => mime.addTypes({
            '.report': 'application/vnd.example.report', REPORT: 'application/vnd.example.other',
        }), TypeError);
    });

    test('returns octet-stream for unknown extension', () => {
        const mime = new TeqFw_Web_Back_Helper_Mime();
        assert.strictEqual(mime.getByExt('.unknown-ext'), 'application/octet-stream');
    });
});
