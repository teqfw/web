/**
 * Start HTTP server to process web requests.
 * @namespace TeqFw_Web_Back_Cli_Next_Start
 */
// MODULE'S IMPORT
import {join} from 'path';
import {existsSync, mkdirSync, writeFileSync} from 'fs';
import {castBoolean} from "@teqfw/core/src/Shared/Util/Cast.mjs";

// DEFINE WORKING VARS
const NS = 'TeqFw_Web_Back_Cli_Next_Start';
const OPT_CERT = 'cert';
const OPT_HTTP1 = 'http1';
const OPT_KEY = 'key';
const OPT_PORT = 'port';

// DEFINE MODULE'S FUNCTIONS
/**
 * Factory to create CLI command.
 *
 * @param {TeqFw_Di_Shared_SpecProxy} spec
 * @returns {TeqFw_Core_Back_Api_Dto_Command}
 * @memberOf TeqFw_Web_Back_Cli_Next_Start
 */
export default function Factory(spec) {
    // EXTRACT DEPS
    /** @type {TeqFw_Web_Back_Defaults} */
    const DEF = spec['TeqFw_Web_Back_Defaults$'];
    /** @type {TeqFw_Core_Shared_Util_Cast.castBoolean|function} */
    const castBoolean = spec['TeqFw_Core_Shared_Util_Cast.castBoolean'];
    /** @type {TeqFw_Core_Shared_Util_Cast.castInt|function} */
    const castInt = spec['TeqFw_Core_Shared_Util_Cast.castInt'];
    /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
    const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];
    /** @type {TeqFw_Di_Shared_Api_IProxy} */
    const proxyServer = spec['TeqFw_Web_Back_NextServer@'];
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
     * @memberOf TeqFw_Web_Back_Cli_Next_Start
     */
    const action = async function (opts) {
        logger.pause(false);
        logger.info('Starting HTTP server.');
        try {
            // collect startup configuration from command option
            const cert = castString(opts[OPT_CERT]);
            const key = castString(opts[OPT_KEY]);
            const port = castInt(opts[OPT_PORT]);
            const useHttp1 = castBoolean(opts[OPT_HTTP1]);
            // create server from proxy then run it
            /** @type {TeqFw_Web_Back_NextServer} */
            const server = await proxyServer.create;
            await server.run({port, useHttp1, cert, key});
        } catch (e) {
            console.error('%s', e);
        }
    };
    Object.defineProperty(action, 'name', {value: `${NS}.${action.name}`});

    // COMPOSE RESULT
    const res = fCommand.create();
    res.realm = DEF.CLI_PREFIX;
    res.name = 'next-server-start';
    res.desc = 'Start web server (HTTP/1 or HTTP/2).';
    res.action = action;
    // add option --http1
    const optHttp1 = fOpt.create();
    optHttp1.flags = `-d, --${OPT_HTTP1}`;
    optHttp1.description = `use (d)eprecated HTTP/1 server (default: HTTP/2)`;
    res.opts.push(optHttp1);
    // add option --port
    const optPort = fOpt.create();
    optPort.flags = `-p, --${OPT_PORT} <port>`;
    optPort.description = `port to use (default: ${DEF.DATA_SERVER_PORT})`;
    res.opts.push(optPort);
    // add option --key
    const optKey = fOpt.create();
    optKey.flags = `-k, --${OPT_KEY} <path>`;
    optKey.description = `private key in PEM format to secure HTTP/2 server.`;
    res.opts.push(optKey);
    // add option --cert
    const optCert = fOpt.create();
    optCert.flags = `-c, --${OPT_CERT} <path>`;
    optCert.description = `certificates chain in PEM format to secure HTTP/2 server.`;
    res.opts.push(optCert);
    return res;
}

// finalize code components for this es6-module
Object.defineProperty(Factory, 'name', {value: `${NS}.${Factory.name}`});
