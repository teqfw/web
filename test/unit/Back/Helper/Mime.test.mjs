import {describe, test} from 'node:test';
import assert from 'node:assert/strict';
import TeqFw_Web_Back_Helper_Mime from '../../../../src/Back/Helper/Mime.mjs';

describe('TeqFw_Web_Back_Helper_Mime', () => {
    test('returns built-in MIME types by extension', () => {
        const mime = new TeqFw_Web_Back_Helper_Mime();
        assert.strictEqual(mime.getByExt('.html'), 'text/html; charset=utf-8');
        assert.strictEqual(mime.getByExt('.MJS'), 'application/javascript');
    });

    test('adds UTF-8 to built-in textual types only', () => {
        const mime = new TeqFw_Web_Back_Helper_Mime();
        const expected = {
            '.txt': 'text/plain; charset=utf-8',
            '.md': 'text/markdown; charset=utf-8',
            '.html': 'text/html; charset=utf-8',
            '.css': 'text/css; charset=utf-8',
            '.csv': 'text/csv; charset=utf-8',
            '.ics': 'text/calendar; charset=utf-8',
            '.png': 'image/png',
            '.json': 'application/json',
        };

        for (const [extension, mimeType] of Object.entries(expected)) {
            assert.strictEqual(mime.getByExt(extension), mimeType);
        }
    });

    test('includes modern web and document MIME types', () => {
        const mime = new TeqFw_Web_Back_Helper_Mime();
        const expected = {
            '.md': 'text/markdown; charset=utf-8',
            '.markdown': 'text/markdown; charset=utf-8',
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

    test('supports textual and binary custom content types', () => {
        const mime = new TeqFw_Web_Back_Helper_Mime();
        mime.addTypes({
            '.custom': 'text/x-custom',
            '.explicit': 'text/x-explicit; charset=windows-1252',
            '.binary': 'application/x-binary',
        });

        assert.strictEqual(mime.getByExt('.custom'), 'text/x-custom; charset=utf-8');
        assert.strictEqual(mime.getByExt('.explicit'), 'text/x-explicit; charset=windows-1252');
        assert.strictEqual(mime.getByExt('.binary'), 'application/x-binary');
    });

    test('gives built-in mappings precedence over custom mappings', () => {
        const mime = new TeqFw_Web_Back_Helper_Mime();
        mime.addTypes({
            HTML: 'application/x-custom-html',
            md: 'application/x-custom-markdown',
        });

        assert.strictEqual(mime.getByExt('.html'), 'text/html; charset=utf-8');
        assert.strictEqual(mime.getByExt('.MD'), 'text/markdown; charset=utf-8');
    });

    test('supports explicit built-in overrides with higher precedence', () => {
        const mime = new TeqFw_Web_Back_Helper_Mime();
        mime.addTypes({
            '.json': 'application/x-custom-json',
        });
        mime.overrideTypes({
            JSON: 'application/ld+json',
            html: 'text/html; charset=windows-1252',
        });

        assert.strictEqual(mime.getByExt('.json'), 'application/ld+json');
        assert.strictEqual(mime.getByExt('.HTML'), 'text/html; charset=windows-1252');
    });

    test('keeps overrides isolated per helper instance', () => {
        /** @type {Record<string, string>} */
        const overrides = {'.json': 'application/ld+json'};
        const first = new TeqFw_Web_Back_Helper_Mime();
        const second = new TeqFw_Web_Back_Helper_Mime();
        first.overrideTypes(overrides);
        overrides['.json'] = 'application/x-mutated';

        assert.strictEqual(first.getByExt('.json'), 'application/ld+json');
        assert.strictEqual(second.getByExt('.json'), 'application/json');
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
        assert.throws(() => mime.addTypes({'.report': 'text/plain; charset='}), TypeError);
        assert.throws(() => mime.addTypes({'.report': 'text/plain; charset=utf-8; charset=ascii'}), TypeError);
        assert.throws(() => mime.addTypes({'.report': 'text/plain; charset=utf 8'}), TypeError);
        assert.throws(() => mime.addTypes({
            '.report': 'application/vnd.example.report', REPORT: 'application/vnd.example.other',
        }), TypeError);
        assert.throws(() => mime.overrideTypes({'.report': 'application/x-report'}), TypeError);
        assert.throws(() => mime.overrideTypes({'.json': 'invalid'}), TypeError);
    });

    test('returns octet-stream for unknown extension', () => {
        const mime = new TeqFw_Web_Back_Helper_Mime();
        assert.strictEqual(mime.getByExt('.unknown-ext'), 'application/octet-stream');
    });
});
