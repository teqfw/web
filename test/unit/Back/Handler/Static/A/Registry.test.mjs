import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import TeqFw_Web_Back_Handler_Static_A_Registry from '../../../../../../src/Back/Handler/Static/A/Registry.mjs';

/** Simple config factory mock */
/** @returns {*} */
function getMockFactory() {
    return { create: (/** @type {*} */ dto) => ({ root: dto.root, prefix: dto.prefix }) };
}

/**
 * @param {*} [onWarn]
 * @returns {*}
 */
function createLoggerProvider(onWarn = () => {}) {
    return {
        forSource: () => ({
            warn: /** @type {(...args: unknown[]) => void} */ (...args) => onWarn(...args),
        }),
    };
}

describe('TeqFw_Web_Back_Handler_Static_A_Registry', () => {
    test('stores initial config', async () => {
        /** @type {TeqFw_Web_Back_Handler_Static_A_Registry} */
        const registry = new TeqFw_Web_Back_Handler_Static_A_Registry({
            configFactory: getMockFactory(),
            logger: createLoggerProvider(),
        });

        registry.addConfigs([/** @type {*} */ ({ root: '/a', prefix: '/p/' })]);
        const match = registry.find('/p/file.txt');

        assert.ok(match);
        assert.strictEqual(match.config.root, '/a');
    });

    test('adds config with new prefix', async () => {
        /** @type {TeqFw_Web_Back_Handler_Static_A_Registry} */
        const registry = new TeqFw_Web_Back_Handler_Static_A_Registry({
            configFactory: getMockFactory(),
            logger: createLoggerProvider(),
        });

        registry.addConfigs([/** @type {*} */ ({ root: '/a', prefix: '/p/' })]);
        registry.addConfigs([/** @type {*} */ ({ root: '/b', prefix: '/p/s/' })]);

        const match = registry.find('/p/s/file.txt');
        assert.ok(match);
        assert.strictEqual(match.config.root, '/b');
    });

    test('ignores config with existing prefix', async () => {
        /** @type {TeqFw_Web_Back_Handler_Static_A_Registry} */
        const registry = new TeqFw_Web_Back_Handler_Static_A_Registry({
            configFactory: getMockFactory(),
            logger: createLoggerProvider(),
        });

        registry.addConfigs([/** @type {*} */ ({ root: '/a', prefix: '/p/' })]);
        registry.addConfigs([/** @type {*} */ ({ root: '/b', prefix: '/p/s/' })]);
        registry.addConfigs([/** @type {*} */ ({ root: '/c', prefix: '/p/s/' })]);

        const match = registry.find('/p/s/test.txt');
        assert.ok(match);
        assert.strictEqual(match.config.root, '/b');
    });

    test('logs warning when prefix already exists', async () => {
        /** @type {Array<*>} */
        const log = [];
        /** @type {TeqFw_Web_Back_Handler_Static_A_Registry} */
        const registry = new TeqFw_Web_Back_Handler_Static_A_Registry({
            configFactory: getMockFactory(),
            logger: createLoggerProvider(/** @type {(...args: unknown[]) => void} */ ((...args) => log.push(args))),
        });

        registry.addConfigs([/** @type {*} */ ({ root: '/a', prefix: '/p/' })]);
        registry.addConfigs([/** @type {*} */ ({ root: '/b', prefix: '/p/' })]);

        assert.strictEqual(log.length, 1);
        assert.ok(log[0][0].includes('/p/'));
    });

    test('prefers longer prefix when matching', async () => {
        /** @type {TeqFw_Web_Back_Handler_Static_A_Registry} */
        const registry = new TeqFw_Web_Back_Handler_Static_A_Registry({
            configFactory: getMockFactory(),
            logger: createLoggerProvider(),
        });

        registry.addConfigs([
            /** @type {*} */ ({ root: '/a', prefix: '/p/' }),
            /** @type {*} */ ({ root: '/b', prefix: '/p/s/' })
        ]);

        const match1 = registry.find('/p/s/x.txt');
        const match2 = registry.find('/p/y.txt');

        assert.ok(match1);
        assert.ok(match2);
        assert.strictEqual(match1.config.root, '/b');
        assert.strictEqual(match2.config.root, '/a');
    });
});
