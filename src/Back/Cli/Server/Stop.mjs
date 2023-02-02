/**
 * Stop web server.
 * @namespace TeqFw_Web_Back_Cli_Server_Stop
 */
// MODULE'S IMPORT
import $path from 'path';
import $fs from 'fs';

// DEFINE WORKING VARS
const NS = 'TeqFw_Web_Back_Cli_Server_Stop';

// DEFINE MODULE'S FUNCTIONS
/**
 * Factory to create CLI command.
 *
 * @param {TeqFw_Di_Shared_SpecProxy} spec
 * @returns {TeqFw_Core_Back_Api_Dto_Command}
 * @memberOf TeqFw_Web_Back_Cli_Server_Stop
 */
export default function Factory(spec) {
    // DEPS
    /** @type {TeqFw_Web_Back_Defaults} */
    const DEF = spec['TeqFw_Web_Back_Defaults$'];
    /** @type {TeqFw_Core_Back_Config} */
    const config = spec['TeqFw_Core_Back_Config$'];
    /** @type {TeqFw_Core_Back_App} */
    const app = spec['TeqFw_Core_Back_App$'];
    /** @type {Function} */
    const castInt = spec['TeqFw_Core_Shared_Util_Cast#castInt'];
    /** @type {TeqFw_Core_Back_Api_Dto_Command.Factory} */
    const fCommand = spec['TeqFw_Core_Back_Api_Dto_Command#Factory$'];

    // FUNCS
    /**
     * Stop web server.
     * @returns {Promise<void>}
     * @memberOf TeqFw_Web_Back_Cli_Server_Stop
     */
    const action = async function () {
        const pidPath = $path.join(config.getPathToRoot(), DEF.DATA_FILE_PID);
        const data = $fs.readFileSync(pidPath);
        const pid = castInt(data);
        console.info(`Stop web server (PID: ${pid}).`);
        try {
            process.kill(pid, 'SIGINT');
        } catch (e) {
            console.error('Cannot kill web server process.');
        }
        await app.stop();
    };
    Object.defineProperty(action, 'namespace', {value: NS});

    // COMPOSE RESULT
    const res = fCommand.create();
    res.realm = DEF.CLI_PREFIX;
    res.name = 'server-stop';
    res.desc = 'stop web server';
    res.action = action;
    return res;
}

// finalize code components for this es6-module
Object.defineProperty(Factory, 'namespace', {value: NS});
