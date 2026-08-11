// @ts-check

/**
 * @namespace TeqFw_Web_Cli_Command_Start
 * @description CLI command to start the web server as a long-running process.
 */
export default class Start {
    /**
     * @param {object} deps
     * @param {TeqFw_Web_Back_Server} deps.server
     * @param {TeqFw_Web_Back_Config_Runtime__Factory} deps.configFactory
     */
    constructor({server, configFactory}) {

        /**
         * @type {'long-running'}
         */
        this.lifetime = 'long-running';

        /**
         * @type {string}
         */
        this.id = 'web:start';

        /**
         * @type {string}
         */
        this.summary = 'Start the web server.';

        /**
         * Start the web server. Freezes runtime configuration, then binds and listens.
         * Returns a runtime handle for graceful shutdown via AbortSignal.
         *
         * @param {object} context
         * @param {AbortSignal} context.signal
         * @returns {Promise<TeqFw_Web_Cli_Command_Start_Handle>}
         */
        this.start = async function (context) {
            configFactory.freeze();
            await server.start();
            return {
                done: /** @type {Promise<void>} */ (new Promise((resolve) => {
                    context.signal.addEventListener('abort', () => resolve(), {once: true});
                })),
                stop: async () => {
                    await server.stop();
                },
            };
        };
    }
}

/**
 * Dependencies for the CLI start command.
 */
export const __deps__ = Object.freeze({
    default: {
        server: 'TeqFw_Web_Back_Server$',
        configFactory: 'TeqFw_Web_Back_Config_Runtime__Factory$',
    },
});
