import Container from '@teqfw/di';
import NamespaceRegistry from '@teqfw/di/node/registry/namespace';
import fs from 'node:fs/promises';
import path from 'node:path';
import TeqFw_Web_Back_Server from '../../src/Back/Server.mjs';

const PORT = Number.parseInt(process.env.PORT ?? '3000', 10);
const APP_ROOT = path.resolve(import.meta.dirname, '../..');
const WEB_ROOT = path.resolve(import.meta.dirname, './web');

/**
 * @param {import("node:http").Server|import("node:http2").Http2Server|import("node:http2").Http2SecureServer|undefined} instance
 * @returns {Promise<void>}
 */
function waitForServerStart(instance) {
    if (!instance) throw new Error('Server instance is not set');
    return new Promise((resolve, reject) => {
        const onListening = () => {
            instance.off('error', onError);
            resolve();
        };
        const onError = (/** @type {Error} */ error) => {
            instance.off('listening', onListening);
            reject(error);
        };

        instance.once('listening', onListening);
        instance.once('error', onError);
    });
}

async function main() {
    const container = new Container();
    const registry = new NamespaceRegistry({fs, path, appRoot: APP_ROOT});
    for (const {prefix, dirAbs, ext} of await registry.build()) {
        container.addNamespaceRoot(prefix, dirAbs, ext);
    }

    const cfgLoader = await container.get('TeqFw_Cfg_Loader$');
    const cfgObject = await container.get('TeqFw_Cfg_Source_Object$');
    const cfgProcessEnv = await container.get('TeqFw_Cfg_Source_ProcessEnv$');
    await cfgLoader.load([
        cfgObject.create({TEQFW_WEB__PORT: PORT}, 'development-defaults'),
        cfgProcessEnv.create(process.env),
    ]);

    /** @type {TeqFw_Web_Back_PipelineEngine} */
    const pipelineEngine = await container.get('TeqFw_Web_Back_PipelineEngine$');
    /** @type {TeqFw_Web_Back_Dto_Source__Factory} */
    const sourceDtoFactory = await container.get('TeqFw_Web_Back_Dto_Source__Factory$');
    /** @type {TeqFw_Web_Back_Handler_Pre_Log} */
    const logHandler = await container.get('TeqFw_Web_Back_Handler_Pre_Log$');
    /** @type {TeqFw_Web_Back_Handler_Static} */
    const staticHandler = await container.get('TeqFw_Web_Back_Handler_Static$');
    /** @type {TeqFw_Web_Back_Config_Runtime__Factory} */
    const runtimeConfigFactory = await container.get('TeqFw_Web_Back_Config_Runtime__Factory$');

    await staticHandler.init({
        sources: [
            sourceDtoFactory.create({
                root: WEB_ROOT,
                prefix: '/',
                allow: {
                    '.': ['.'],
                },
            }),
        ],
    });

    pipelineEngine.addHandler(logHandler);
    pipelineEngine.addHandler(staticHandler);

    /** @type {TeqFw_Log_Provider} */
    const logger = await container.get('TeqFw_Log_Provider$');
    /** @type {TeqFw_Web_Back_Enum_Server_Type} */
    const SERVER_TYPE = await container.get('TeqFw_Web_Back_Enum_Server_Type$');
    runtimeConfigFactory.freeze();
    /** @type {TeqFw_Web_Back_Config_Runtime} */
    const config = await container.get('TeqFw_Web_Back_Config_Runtime$');

    const server = new TeqFw_Web_Back_Server({
        http: await import('node:http'),
        http2: await import('node:http2'),
        config,
        logger,
        pipelineEngine,
        SERVER_TYPE,
    });

    await server.start();
    await waitForServerStart(server.getInstance());

    const shutdown = async (/** @type {string} */ signal) => {
        console.info(`[dev] Received ${signal}, stopping server...`);
        await server.stop();
        process.exit(0);
    };

    process.once('SIGINT', () => void shutdown('SIGINT'));
    process.once('SIGTERM', () => void shutdown('SIGTERM'));

    console.info(`[dev] Static smoke server is running on http://127.0.0.1:${PORT}/`);
    console.info(`[dev] Web root: ${WEB_ROOT}`);
    console.info('[dev] Open the URL in a browser and verify that static files are served.');
}

main().catch((error) => {
    console.error('[dev] Bootstrap failed');
    console.error(error);
    process.exit(1);
});
