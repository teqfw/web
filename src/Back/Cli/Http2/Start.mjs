/**
 * Start HTTP/2 server to process web requests.
 * @namespace TeqFw_Web_Back_Cli_Http2_Start
 */
// MODULE'S IMPORT
import $path from 'path';
import $fs from 'fs';

// DEFINE WORKING VARS
const NS = 'TeqFw_Web_Back_Cli_Http2_Start';

// DEFINE MODULE'S FUNCTIONS
/**
 * Factory to create CLI command.
 *
 * @param {TeqFw_Di_SpecProxy} spec
 * @returns {TeqFw_Core_Back_Api_Dto_Command}
 * @constructor
 * @memberOf TeqFw_Web_Back_Cli_Http2_Start
 */
function Factory(spec) {
    // EXTRACT DEPS
    /** @type {TeqFw_Web_Defaults} */
    const DEF = spec['TeqFw_Web_Defaults$']; // singleton
    /** @type {TeqFw_Core_Back_App.Bootstrap} */
    const cfg = spec['TeqFw_Core_Back_App#Bootstrap$']; // singleton
    /** @type {TeqFw_Di_Container} */
    const container = spec['TeqFw_Di_Container$']; // singleton
    /** @type {TeqFw_Core_Back_Config} */
    const config = spec['TeqFw_Core_Back_Config$']; // singleton
    /** @type {TeqFw_Core_Logger} */
    const logger = spec['TeqFw_Core_Logger$']; // singleton
    /** @type {Function|TeqFw_Core_Back_Api_Dto_Command.Factory} */
    const fCommand = spec['TeqFw_Core_Back_Api_Dto_Command#Factory$']; // singleton

    // DEFINE INNER FUNCTIONS
    /**
     * Start the HTTP/2 server.
     * @returns {Promise<void>}
     * @memberOf TeqFw_Web_Back_Cli_Http2_Start
     */
    const action = async function () {
        logger.info('Starting HTTP/2 server.');
        try {
            /**
             * TODO: We have not lazy loading for DI yet, so we need to use Container directly
             * TODO: to prevent all deps loading.
             */
            /** @type {TeqFw_Web_Back_Http2_Server} */
            const server = await container.get('TeqFw_Web_Back_Http2_Server$');
            await server.init();

            // collect startup configuration then compose path to PID file
            const portCfg = config.get('local/server/port');
            const port = portCfg || DEF.DATA.SERVER_PORT;
            const pid = process.pid.toString();
            const pidPath = $path.join(cfg.root, DEF.DATA.FILE_PID_HTTP2);

            // write PID to file then start the server
            $fs.writeFileSync(pidPath, pid);
            await server.listen(port);

            logger.info(`HTTP/2 server is listening on port ${port}. PID: ${pid}.`);
        } catch (e) {
            console.error('%s', e);
        }
    };
    Object.defineProperty(action, 'name', {value: `${NS}.${action.name}`});

    // COMPOSE RESULT
    const res = fCommand.create();
    res.realm = DEF.REALM;
    res.name = 'http2-start';
    res.desc = 'Start the HTTP/2 server.';
    res.action = action;
    return res;
}

// MODULE'S EXPORT
Object.defineProperty(Factory, 'name', {value: `${NS}.${Factory.name}`});
export default Factory;
