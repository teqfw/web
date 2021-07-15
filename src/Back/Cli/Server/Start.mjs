/**
 * Start HTTP/1 server to process web requests.
 * @namespace TeqFw_Web_Back_Cli_Server_Start
 */
// MODULE'S IMPORT
import $path from 'path';
import $fs from 'fs';

// DEFINE WORKING VARS
const NS = 'TeqFw_Web_Back_Cli_Server_Start';
const OPT_PORT = 'port';

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
    /** @type {TeqFw_Di_Shared_Container} */
    const container = spec['TeqFw_Di_Shared_Container$'];
    /** @type {TeqFw_Core_Back_Config} */
    const config = spec['TeqFw_Core_Back_Config$'];
    /** @type {TeqFw_Core_Shared_Logger} */
    const logger = spec['TeqFw_Core_Shared_Logger$'];
    /** @type {TeqFw_Core_Back_Api_Dto_Command.Factory} */
    const fCommand = spec['TeqFw_Core_Back_Api_Dto_Command#Factory$'];
    /** @type {TeqFw_Core_Back_Api_Dto_Command_Option.Factory} */
    const fOpt = spec['TeqFw_Core_Back_Api_Dto_Command_Option#Factory$'];

    // DEFINE INNER FUNCTIONS
    /**
     * Start the HTTP/1 server.
     *
     * @param {Object} opts command options
     * @returns {Promise<void>}
     * @memberOf TeqFw_Web_Back_Cli_Server_Start
     */
    const action = async function (opts) {
        logger.pause(false);
        logger.info('Starting HTTP/1 server.');
        try {
            /**
             * TODO: We have not lazy loading for DI yet, so we need to use Container directly
             * TODO: to prevent all deps loading.
             */
            /** @type {TeqFw_Web_Back_Server} */
            const server = await container.get('TeqFw_Web_Back_Server$');
            await server.init();

            // collect startup configuration then compose path to PID file
            // port from command option
            const portOpt = opts[OPT_PORT];
            // port from local configuration
            /** @type {TeqFw_Web_Back_Api_Dto_Config} */
            const cfgLocal = config.getLocal(DEF.DESC_NODE);
            const portCfg = cfgLocal?.server?.port;
            // use port: command opt / local cfg / default
            const port = portOpt || portCfg || DEF.DATA_SERVER_PORT;
            const pid = process.pid.toString();
            const pidPath = $path.join(config.getBoot().projectRoot, DEF.DATA_FILE_PID);

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
    // add option --port
    const optShort = fOpt.create();
    optShort.flags = `-p, --${OPT_PORT} <port>`;
    optShort.description = `port to use (default: ${DEF.DATA_SERVER_PORT})`;
    res.opts.push(optShort);
    return res;
}

// MODULE'S EXPORT
Object.defineProperty(Factory, 'name', {value: `${NS}.${Factory.name}`});
export default Factory;
