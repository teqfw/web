import {describe, test, beforeEach} from 'node:test';
import assert from 'node:assert/strict';
import TeqFw_Web_Back_Server from '../../../src/Back/Server.mjs';
import TeqFw_Web_Back_Enum_Server_Type from '../../../src/Back/Enum/Server/Type.mjs';

/**
 * @param {Array<*>} log
 * @returns {*}
 */
function createLoggerProvider(log) {
    return {
        forSource: () => ({
            info: /** @type {(...args: unknown[]) => void} */ (...args) => { log.push(['info', ...args]); },
            error: /** @type {(...args: unknown[]) => void} */ (...args) => { log.push(['error', ...args]); },
            warn: /** @type {(...args: unknown[]) => void} */ (...args) => { log.push(['warn', ...args]); },
        }),
    };
}

describe('TeqFw_Web_Back_Server (mocked)', () => {

    /** @type {Array<*>} */
    const log = [];
    /** @type {*} */
    let logger;
    /** @type {*} */
    let pipelineEngine;
    /** @type {*} */
    let server;

    // Mocks for HTTP/1 and HTTP/2 servers
    /** @type {*} */
    const mockHttp = {
        createServer: () => ({
            listen: /** @type {(...args: unknown[]) => void} */ (...args) => { log.push(['http.listen', ...args]); },
            on: () => { log.push('http.on'); },
            close: (/** @type {*} */ cb) => { log.push('http.close'); cb && cb(); },
        }),
    };

    /** @type {*} */
    const mockHttp2 = {
        createServer: () => ({
            listen: /** @type {(...args: unknown[]) => void} */ (...args) => { log.push(['http2.listen', ...args]); },
            on: () => { log.push('http2.on'); },
            close: (/** @type {*} */ cb) => { log.push('http2.close'); cb && cb(); },
        }),
        createSecureServer: (/** @type {*} */ tlsOpts) => ({
            listen: /** @type {(...args: unknown[]) => void} */ (...args) => { log.push(['http2s.listen', ...args]); },
            on: () => { log.push('http2s.on'); },
            close: (/** @type {*} */ cb) => { log.push('http2s.close'); cb && cb(); },
        })
    };

    beforeEach(() => {
        log.length = 0;
        logger = createLoggerProvider(log);
        pipelineEngine = {
            lockHandlers: () => log.push('pipeline.lockHandlers'),
            handleRequest: () => {},
        };
        server = new TeqFw_Web_Back_Server({
            http: mockHttp,
            http2: mockHttp2,
            config: /** @type {TeqFw_Web_Back_Config_Runtime} */ (Object.freeze({port: 3000, type: 'http'})),
            logger,
            pipelineEngine,
            SERVER_TYPE: new TeqFw_Web_Back_Enum_Server_Type(),
        });
    });

    test('should start in HTTP/1 mode by default', async () => {
        /** @type {TeqFw_Web_Back_Server} */
        await server.start(); // default mode is HTTP/1
        assert.deepStrictEqual(log, [
            'pipeline.lockHandlers',
            ['info', 'Starting server in HTTP/1 mode on port 3000...'],
            'http.on',
            ['http.listen', 3000],
        ]);
    });

    test('should start in HTTP/2 mode on the specified host and port', async () => {
        /** @type {TeqFw_Web_Back_Server} */
        await server.start({host: '127.0.0.1', type: 'http2', port: 8080});
        assert.deepStrictEqual(log, [
            'pipeline.lockHandlers',
            ['info', 'Starting server in HTTP/2 mode on host 127.0.0.1 and port 8080...'],
            'http2.on',
            ['http2.listen', 8080, '127.0.0.1'],
        ]);
    });

    test('should start in HTTPS/2 mode with TLS config', async () => {
        /** @type {TeqFw_Web_Back_Server} */
        await server.start({host: '::1', type: 'https', port: 8443, tls: {key: 'a', cert: 'b'}});
        assert.deepStrictEqual(log, [
            'pipeline.lockHandlers',
            ['info', 'Starting server in HTTPS (HTTP/2 + TLS) mode on host ::1 and port 8443...'],
            'http2s.on',
            ['http2s.listen', 8443, '::1'],
        ]);
    });

    test('should throw error if TLS config is missing in HTTPS mode', async () => {
        /** @type {TeqFw_Web_Back_Server} */
        await assert.rejects(
            () => server.start({type: 'https', port: 1234}),
            /TLS key and certificate are required/
        );
        assert.deepStrictEqual(log.at(-1), ['error', 'HTTPS server requires TLS key and certificate']);
    });

    test('should throw error on unsupported server type', async () => {
        /** @type {TeqFw_Web_Back_Server} */
        await assert.rejects(
            () => server.start({type: 'ftp', port: 21}),
            /not supported/
        );
        assert.deepStrictEqual(log.at(-1), ['error', 'Unsupported server type: ftp']);
    });

    test('should stop the server', async () => {
        /** @type {TeqFw_Web_Back_Server} */
        await server.start();
        await server.stop();
        assert.deepStrictEqual(log.slice(-2), [
            'http.close',
            ['info', 'Server stopped'],
        ]);
    });
});
