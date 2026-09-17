import {describe, test} from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

async function loadRuntimeModule() {
    const href = pathToFileURL(path.resolve(import.meta.dirname, '../../../../src/Back/Config/Runtime.mjs')).href;
    return import(`${href}?case=${Math.random()}`);
}

async function loadRuntimeTlsModule() {
    const href = pathToFileURL(path.resolve(import.meta.dirname, '../../../../src/Back/Config/Runtime/Tls.mjs')).href;
    return import(`${href}?case=${Math.random()}`);
}

function createReader(values = {}) {
    return {get: (/** @type {string} */ namespace) => {
        assert.equal(namespace, 'TEQFW_WEB');
        return values;
    }};
}

describe('TeqFw_Web_Back_Config_Runtime', () => {
    test('uses flat runtime values after freeze and keeps first write wins', async () => {
        const {default: RuntimeConfig, Factory} = await loadRuntimeModule();
        const {default: Cast} = await import('../../../../src/Back/Helper/Cast.mjs');
        const {default: ServerType} = await import('../../../../src/Back/Enum/Server/Type.mjs');
        const {Factory: TlsFactory} = await loadRuntimeTlsModule();

        const cast = new Cast();
        const runtime = new RuntimeConfig({
            cast,
            SERVER_TYPE: new ServerType(),
            reader: createReader(),
            tlsFactory: new TlsFactory({cast}),
        });
        const factory = new Factory({
            cast,
            SERVER_TYPE: new ServerType(),
            reader: createReader(),
            tlsFactory: new TlsFactory({cast}),
        });

        assert.throws(() => runtime.port, /not initialized/);
        Object.freeze(runtime);
        assert.equal(Object.isFrozen(runtime), true);

        factory.configure({host: '127.0.0.1', port: '8080', type: 'http2'});
        factory.configure({host: '0.0.0.0', port: '9090', type: 'https'});
        factory.freeze();

        assert.equal(runtime.host, '127.0.0.1');
        assert.equal(runtime.port, 8080);
        assert.equal(runtime.type, 'http2');
        assert.throws(() => {
            runtime.port = 9090;
        }, /immutable/);
        assert.throws(() => factory.configure({port: 1}), /frozen/);
        assert.equal(factory.freeze(), runtime);
    });

    test('applies defaults on freeze', async () => {
        const {default: RuntimeConfig, Factory} = await loadRuntimeModule();
        const {default: Cast} = await import('../../../../src/Back/Helper/Cast.mjs');
        const {default: ServerType} = await import('../../../../src/Back/Enum/Server/Type.mjs');
        const {Factory: TlsFactory} = await loadRuntimeTlsModule();

        const cast = new Cast();
        const runtime = new RuntimeConfig({
            cast,
            SERVER_TYPE: new ServerType(),
            reader: createReader(),
            tlsFactory: new TlsFactory({cast}),
        });
        const factory = new Factory({
            cast,
            SERVER_TYPE: new ServerType(),
            reader: createReader(),
            tlsFactory: new TlsFactory({cast}),
        });

        Object.freeze(runtime);
        assert.equal(Object.isFrozen(runtime), true);
        factory.freeze();

        assert.equal(runtime.host, undefined);
        assert.equal(runtime.port, 3000);
        assert.equal(runtime.type, 'http');
    });

    test('requires tls for https mode', async () => {
        const {Factory} = await loadRuntimeModule();
        const {default: Cast} = await import('../../../../src/Back/Helper/Cast.mjs');
        const {default: ServerType} = await import('../../../../src/Back/Enum/Server/Type.mjs');
        const {Factory: TlsFactory} = await loadRuntimeTlsModule();

        const cast = new Cast();
        const factory = new Factory({
            cast,
            SERVER_TYPE: new ServerType(),
            reader: createReader(),
            tlsFactory: new TlsFactory({cast}),
        });

        factory.configure({type: 'https'});
        assert.throws(() => factory.freeze(), /TLS configuration is required/);
    });

    test('hydrates tls subtree through dedicated runtime component', async () => {
        const {default: RuntimeConfig, Factory} = await loadRuntimeModule();
        const {default: Cast} = await import('../../../../src/Back/Helper/Cast.mjs');
        const {default: ServerType} = await import('../../../../src/Back/Enum/Server/Type.mjs');
        const {Factory: TlsFactory} = await loadRuntimeTlsModule();

        const cast = new Cast();
        const runtime = new RuntimeConfig({
            cast,
            SERVER_TYPE: new ServerType(),
            reader: createReader(),
            tlsFactory: new TlsFactory({cast}),
        });
        const factory = new Factory({
            cast,
            SERVER_TYPE: new ServerType(),
            reader: createReader(),
            tlsFactory: new TlsFactory({cast}),
        });

        factory.configure({type: 'https', tls: {key: 'key', cert: 'cert', ca: 'ca'}});
        factory.freeze();

        assert.equal(runtime.tls.key, 'key');
        assert.equal(runtime.tls.cert, 'cert');
        assert.equal(runtime.tls.ca, 'ca');
        Object.freeze(runtime.tls);
        Object.freeze(runtime);
        assert.equal(Object.isFrozen(runtime.tls), true);
        assert.equal(Object.isFrozen(runtime), true);
    });

    test('projects flat TLS values from the TEQFW_WEB configuration namespace', async () => {
        const {default: RuntimeConfig, Factory} = await loadRuntimeModule();
        const {default: Cast} = await import('../../../../src/Back/Helper/Cast.mjs');
        const {default: ServerType} = await import('../../../../src/Back/Enum/Server/Type.mjs');
        const {Factory: TlsFactory} = await loadRuntimeTlsModule();

        const cast = new Cast();
        const runtime = new RuntimeConfig();
        const factory = new Factory({
            cast,
            SERVER_TYPE: new ServerType(),
            reader: createReader({
                TYPE: 'https',
                TLS_CA: 'ca-from-env',
                TLS_CERT: 'cert-from-env',
                TLS_KEY: 'key-from-env',
            }),
            tlsFactory: new TlsFactory({cast}),
        });

        factory.freeze();

        assert.equal(runtime.type, 'https');
        assert.equal(runtime.tls.ca, 'ca-from-env');
        assert.equal(runtime.tls.cert, 'cert-from-env');
        assert.equal(runtime.tls.key, 'key-from-env');
    });

    test('prefers typed TLS cfg values and keeps programmatic values first', async () => {
        const {default: RuntimeConfig, Factory} = await loadRuntimeModule();
        const {default: Cast} = await import('../../../../src/Back/Helper/Cast.mjs');
        const {default: ServerType} = await import('../../../../src/Back/Enum/Server/Type.mjs');
        const {Factory: TlsFactory} = await loadRuntimeTlsModule();

        const cast = new Cast();
        const runtime = new RuntimeConfig();
        const factory = new Factory({
            cast,
            SERVER_TYPE: new ServerType(),
            reader: createReader({
                TYPE: 'https',
                TLS: {cert: 'cert-from-typed-cfg'},
                TLS_CA: 'ca-from-flat-cfg',
                TLS_CERT: 'cert-from-flat-cfg',
                TLS_KEY: 'key-from-flat-cfg',
            }),
            tlsFactory: new TlsFactory({cast}),
        });

        factory.configure({tls: {key: 'key-from-code'}});
        factory.freeze();

        assert.equal(runtime.tls.ca, 'ca-from-flat-cfg');
        assert.equal(runtime.tls.cert, 'cert-from-typed-cfg');
        assert.equal(runtime.tls.key, 'key-from-code');
    });

    test('rejects malformed typed and flat TLS configuration', async () => {
        const {Factory} = await loadRuntimeModule();
        const {default: Cast} = await import('../../../../src/Back/Helper/Cast.mjs');
        const {default: ServerType} = await import('../../../../src/Back/Enum/Server/Type.mjs');
        const {Factory: TlsFactory} = await loadRuntimeTlsModule();

        const cast = new Cast();
        const createFactory = (/** @type {Record<string, unknown>} */ values) => new Factory({
            cast,
            SERVER_TYPE: new ServerType(),
            reader: createReader(values),
            tlsFactory: new TlsFactory({cast}),
        });

        assert.throws(
            () => createFactory({TLS: 'certificate=not-an-object'}).freeze(),
            /Invalid TLS configuration: expected an object/
        );
        assert.throws(
            () => createFactory({TLS_CERT: null}).freeze(),
            /Invalid TLS configuration field "cert": expected a string/
        );
    });

    test('reads transport settings from the TEQFW_WEB configuration namespace', async () => {
        const {default: RuntimeConfig, Factory} = await loadRuntimeModule();
        const {default: Cast} = await import('../../../../src/Back/Helper/Cast.mjs');
        const {default: ServerType} = await import('../../../../src/Back/Enum/Server/Type.mjs');
        const {Factory: TlsFactory} = await loadRuntimeTlsModule();

        const cast = new Cast();
        const runtime = new RuntimeConfig();
        const factory = new Factory({
            cast,
            SERVER_TYPE: new ServerType(),
            reader: createReader({HOST: '127.0.0.1', PORT: '8080', TYPE: 'https', TLS: {key: 'key', cert: 'cert'}}),
            tlsFactory: new TlsFactory({cast}),
        });

        factory.freeze();

        assert.equal(runtime.host, '127.0.0.1');
        assert.equal(runtime.port, 8080);
        assert.equal(runtime.type, 'https');
        assert.equal(runtime.tls.key, 'key');
        assert.equal(runtime.tls.cert, 'cert');
    });
});
