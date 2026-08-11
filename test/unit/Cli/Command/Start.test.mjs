import {describe, test, beforeEach} from 'node:test';
import assert from 'node:assert/strict';
import TeqFw_Web_Cli_Command_Start from '../../../../src/Cli/Command/Start.mjs';

describe('TeqFw_Web_Cli_Command_Start (mocked)', () => {
    /** @type {TeqFw_Web_Cli_Command_Start} */
    let command;
    /** @type {Array<*>} */
    let log;
    /** @type {{started: boolean, stopped: boolean}} */
    let serverState;
    /** @type {boolean} */
    let configFrozen;

    beforeEach(() => {
        log = [];
        serverState = {started: false, stopped: false};
        configFrozen = false;

        const mockServer = {
            start: async () => {
                serverState.started = true;
                log.push('server.start');
            },
            stop: async () => {
                serverState.stopped = true;
                log.push('server.stop');
            },
        };

        const mockConfigFactory = {
            freeze: () => {
                configFrozen = true;
                log.push('config.freeze');
            },
        };

        command = new TeqFw_Web_Cli_Command_Start({
            server: /** @type {*} */ (mockServer),
            configFactory: /** @type {*} */ (mockConfigFactory),
        });
    });

    test('has correct metadata', () => {
        assert.deepStrictEqual(command.lifetime, 'long-running');
        assert.deepStrictEqual(command.id, 'web:start');
        assert.deepStrictEqual(command.summary, 'Start the web server.');
    });

    test('start: freezes config and starts the server', async () => {
        const controller = new AbortController();
        const context = {signal: controller.signal};

        const runtime = await command.start(context);

        assert.deepStrictEqual(configFrozen, true);
        assert.deepStrictEqual(serverState.started, true);
        assert.deepStrictEqual(log, ['config.freeze', 'server.start']);
        assert.deepStrictEqual(typeof runtime.done, 'object');
        assert.deepStrictEqual(typeof runtime.stop, 'function');
    });

    test('start: returned stop function stops the server', async () => {
        const controller = new AbortController();
        const context = {signal: controller.signal};

        const runtime = await command.start(context);
        await runtime.stop();

        assert.deepStrictEqual(serverState.stopped, true);
        assert.deepStrictEqual(log, ['config.freeze', 'server.start', 'server.stop']);
    });

    test('start: done resolves on abort signal', async () => {
        const controller = new AbortController();
        const context = {signal: controller.signal};

        const runtime = await command.start(context);
        controller.abort();
        await runtime.done;

        assert.deepStrictEqual(serverState.started, true);
    });

    test('start: abort triggers stop sequence', async () => {
        const controller = new AbortController();
        const context = {signal: controller.signal};

        const runtime = await command.start(context);

        controller.abort();
        await runtime.done;
        await runtime.stop();

        assert.deepStrictEqual(serverState.stopped, true);
    });
});
