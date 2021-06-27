/**
 * Stop HTTP/1 server.
 * @namespace TeqFw_Web_Back_Cli_Http1_Stop
 */
// MODULE'S IMPORT
import $path from 'path';
import $fs from 'fs';

// DEFINE WORKING VARS
const NS = 'TeqFw_Web_Back_Cli_Http1_Stop';

// DEFINE MODULE'S FUNCTIONS
/**
 * Factory to create CLI command.
 *
 * @param {TeqFw_Di_SpecProxy} spec
 * @returns {TeqFw_Core_Back_Api_Dto_Command}
 * @constructor
 * @memberOf TeqFw_Web_Back_Cli_Http1_Stop
 */
function Factory(spec) {
    // EXTRACT DEPS
    /** @type {TeqFw_Web_Defaults} */
    const DEF = spec['TeqFw_Web_Defaults$'];   // singleton
    /** @type {TeqFw_Core_Back_App.Bootstrap} */
    const cfg = spec['TeqFw_Core_Back_App#Bootstrap$']; // singleton
    /** @type {Function|TeqFw_Core_Back_Api_Dto_Command.Factory} */
    const fCommand = spec['TeqFw_Core_Back_Api_Dto_Command#Factory$']; // singleton

    // DEFINE INNER FUNCTIONS
    /**
     * Stop the HTTP/2 server.
     * @returns {Promise<void>}
     * @memberOf TeqFw_Web_Back_Cli_Http1_Stop
     */
    const action = async function () {
        try {
            const pidPath = $path.join(cfg.root, DEF.DATA.FILE_PID_HTTP1);
            const data = $fs.readFileSync(pidPath);
            const pid = Number.parseInt(data.toString());
            console.info(`Stop HTTP/1 server (PID: ${pid}).`);
            process.kill(pid, 'SIGINT');
        } catch (e) {
            console.error('Cannot kill HTTP/1 server process.');
        }
    };
    Object.defineProperty(action, 'name', {value: `${NS}.${action.name}`});

    // COMPOSE RESULT
    const res = fCommand.create();
    res.realm = DEF.REALM;
    res.name = 'http1-stop';
    res.desc = 'Stop the HTTP/1 server.';
    res.action = action;
    return res;
}

// MODULE'S EXPORT
Object.defineProperty(Factory, 'name', {value: `${NS}.${Factory.name}`});
export default Factory;
