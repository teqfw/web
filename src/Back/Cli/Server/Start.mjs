/**
 * Start HTTP server to process web requests.
 * @namespace TeqFw_Web_Back_Cli_Server_Start
 */
// DEFINE WORKING VARS
const NS = 'TeqFw_Web_Back_Cli_Server_Start';
const OPT_CERT = 'cert';
const OPT_HTTP1 = 'http1';
const OPT_KEY = 'key';
const OPT_PORT = 'port';
const OPT_SKIP_PID = 'skipPid'; // skip PID write (for Google App Engine)
const OPT_USE_WS = 'useWs'; // use WebSockets handlers

// DEFINE MODULE'S FUNCTIONS
/**
 * Factory to create CLI command.
 *
 * @param {TeqFw_Di_Shared_SpecProxy} spec
 * @returns {TeqFw_Core_Back_Api_Dto_Command}
 * @memberOf TeqFw_Web_Back_Cli_Server_Start
 */
export default function Factory(spec) {
    // DEPS
    /** @type {TeqFw_Web_Back_Defaults} */
    const DEF = spec['TeqFw_Web_Back_Defaults$'];
    /** @type {TeqFw_Core_Shared_Api_Logger} */
    const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance
    /** @type {TeqFw_Core_Shared_Util_Cast.castBooleanIfExists|function} */
    const castBooleanIfExists = spec['TeqFw_Core_Shared_Util_Cast.castBooleanIfExists'];
    /** @type {TeqFw_Core_Shared_Util_Cast.castInt|function} */
    const castInt = spec['TeqFw_Core_Shared_Util_Cast.castInt'];
    /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
    const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];
    /** @type {TeqFw_Di_Shared_Api_IProxy} */
    const proxyServer = spec['TeqFw_Web_Back_App_Server@'];
    /** @type {TeqFw_Core_Back_Api_Dto_Command.Factory} */
    const fCommand = spec['TeqFw_Core_Back_Api_Dto_Command.Factory$'];
    /** @type {TeqFw_Core_Back_Api_Dto_Command_Option.Factory} */
    const fOpt = spec['TeqFw_Core_Back_Api_Dto_Command_Option.Factory$'];
    /** @type {TeqFw_Core_Back_Mod_App_Pid} */
    const modPid = spec['TeqFw_Core_Back_Mod_App_Pid$'];

    // VARS
    logger.setNamespace(NS);

    // FUNCS
    /**
     * Parse command line options and start server in requested mode.
     *
     * @param {Object} opts command options
     * @returns {Promise<void>}
     * @memberOf TeqFw_Web_Back_Cli_Server_Start
     */
    const action = async function (opts) {
        logger.info('Starting web server.');
        try {
            // collect startup configuration from command option
            const cert = castString(opts[OPT_CERT]);
            const key = castString(opts[OPT_KEY]);
            const port = castInt(opts[OPT_PORT]);
            const skipPID = castBooleanIfExists(opts[OPT_SKIP_PID]);
            const useHttp1 = castBooleanIfExists(opts[OPT_HTTP1]);
            const useWs = castBooleanIfExists(opts[OPT_USE_WS]);
            if (!skipPID) {
                await modPid.writePid(DEF.DATA_FILE_PID);
            }
            // PID is (not) written => start the server
            // create server from proxy then run it
            /** @type {TeqFw_Web_Back_App_Server} */
            const server = await proxyServer.create;
            await server.run({port, useHttp1, cert, key, useWs});
        } catch (e) {
            console.error('%s', e);
        }
    };
    Object.defineProperty(action, 'namespace', {value: NS});

    // COMPOSE RESULT
    const res = fCommand.create();
    res.realm = DEF.CLI_PREFIX;
    res.name = 'server-start';
    res.desc = 'start web server';
    res.action = action;
    // add option --cert
    const optCert = fOpt.create();
    optCert.flags = `-c, --${OPT_CERT} <path>`;
    optCert.description = `certificates chain in PEM format to secure HTTP/2 server`;
    res.opts.push(optCert);
    // add option --http1
    const optHttp1 = fOpt.create();
    optHttp1.flags = `-1, --${OPT_HTTP1}`;
    optHttp1.description = `use HTTP/1 server (default: HTTP/2)`;
    res.opts.push(optHttp1);
    // add option --key
    const optKey = fOpt.create();
    optKey.flags = `-k, --${OPT_KEY} <path>`;
    optKey.description = `private key in PEM format to secure HTTP/2 server`;
    res.opts.push(optKey);
    // add option --port
    const optPort = fOpt.create();
    optPort.flags = `-p, --${OPT_PORT} <port>`;
    optPort.description = `port to use (default: ${DEF.DATA_SERVER_PORT})`;
    res.opts.push(optPort);
    // add option --skip-pid
    const optSkipPID = fOpt.create();
    optSkipPID.flags = `-s, --${OPT_SKIP_PID}`;
    optSkipPID.description = `don't save PID file (used for read-only filesystems like Google AppEngine)`;
    res.opts.push(optSkipPID);
    // add option --use-ws
    const optUseWs = fOpt.create();
    optUseWs.flags = `-w, --${OPT_USE_WS}`;
    optUseWs.description = `use web sockets with this server`;
    res.opts.push(optUseWs);
    return res;
}

// finalize code components for this es6-module
Object.defineProperty(Factory, 'namespace', {value: NS});
