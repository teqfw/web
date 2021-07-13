/**
 * Start HTTP/1 server to process web requests.
 * @namespace TeqFw_Web_Back_Cli_Server_Start
 */
// MODULE'S IMPORT
import $path from 'path';
import $fs from 'fs';

// DEFINE WORKING VARS
const NS = 'TeqFw_Web_Back_Cli_Server_Start';

// DEFINE MODULE'S FUNCTIONS
/**
 * Factory to create CLI command.
 *
 * @param {TeqFw_Di_Shared_SpecProxy} spec
 * @returns {TeqFw_Core_Back_Api_Dto_Command}
 * @memberOf TeqFw_Web_Back_Cli_Server_Start
 */
function Factory(spec) {
    // EXTRACT DEPS
    /** @type {TeqFw_Web_Back_Defaults} */
    const DEF = spec['TeqFw_Web_Back_Defaults$'];
    /** @type {TeqFw_Core_Back_Api_Dto_App_Boot} */
    const cfg = spec['TeqFw_Core_Back_Api_Dto_App_Boot$'];
    /** @type {TeqFw_Di_Shared_Container} */
    const container = spec['TeqFw_Di_Shared_Container$'];
    /** @type {TeqFw_Core_Back_Config} */
    const config = spec['TeqFw_Core_Back_Config$'];
    /** @type {TeqFw_Core_Shared_Logger} */
    const logger = spec['TeqFw_Core_Shared_Logger$'];
    /** @type {Function|TeqFw_Core_Back_Api_Dto_Command.Factory} */
    const fCommand = spec['TeqFw_Core_Back_Api_Dto_Command#Factory$'];

    // DEFINE INNER FUNCTIONS
    /**
     * Start the HTTP/1 server.
     * @returns {Promise<void>}
     * @memberOf TeqFw_Web_Back_Cli_Server_Start
     */
    const action = async function () {
        logger.info('Starting HTTP/1 server.');
        try {
            /**
             * TODO: We have not lazy loading for DI yet, so we need to use Container directly
             * TODO: to prevent all deps loading.
             */
            /** @type {TeqFw_Web_Back_Server} */
            const server = await container.get('TeqFw_Web_Back_Server$');
            await server.init();

            // TODO: add DTO for local config
            // collect startup configuration then compose path to PID file
            const portCfg = config.get('local/server/port');
            const port = portCfg || DEF.DATA_SERVER_PORT;
            const pid = process.pid.toString();
            const pidPath = $path.join(cfg.projectRoot, DEF.DATA_FILE_PID);

            // write PID to file then start the server
            $fs.writeFileSync(pidPath, pid);
            // PID is wrote => start the server
            await server.listen(port);
            logger.info(`HTTP/1 server is listening on port ${port}. PID: ${pid}.`);
        } catch (e) {
            console.error('%s', e);
        }
    };
    Object.defineProperty(action, 'name', {value: `${NS}.${action.name}`});

    // COMPOSE RESULT
    const res = fCommand.create();
    res.realm = DEF.CLI_PREFIX;
    res.name = 'server-start';
    res.desc = 'Start the HTTP/1 server.';
    res.action = action;
    return res;
}

// MODULE'S EXPORT
Object.defineProperty(Factory, 'name', {value: `${NS}.${Factory.name}`});
export default Factory;
