// @ts-check

/**
 * @namespace TeqFw_Web_Back_Cli_Command_Start
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
         * Returns a runtime handle that settles after the host stops the server.
         *
         * @param {object} context
         * @param {AbortSignal} context.signal
         * @returns {Promise<TeqFw_Web_Back_Cli_Command_Start_Handle>}
         */
        this.start = async function (context) {
            configFactory.freeze();
            await server.start();
            /** @type {any} */
            let complete = () => {};
            const done = new Promise(resolve => { complete = () => resolve(undefined); });
            return {
                done,
                stop: async () => {
                    try { await server.stop(); }
                    finally { complete(); }
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
