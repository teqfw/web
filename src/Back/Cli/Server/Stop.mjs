/**
 * Stop HTTP/1 server.
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
    // EXTRACT DEPS
    /** @type {TeqFw_Web_Back_Defaults} */
    const DEF = spec['TeqFw_Web_Back_Defaults$'];
    /** @type {TeqFw_Core_Back_Config} */
    const config = spec['TeqFw_Core_Back_Config$'];
    /** @type {TeqFw_Core_Back_Api_Dto_Command.Factory} */
    const fCommand = spec['TeqFw_Core_Back_Api_Dto_Command#Factory$'];

    // DEFINE INNER FUNCTIONS
    /**
     * Stop the HTTP/1 server.
     * @returns {Promise<void>}
     * @memberOf TeqFw_Web_Back_Cli_Server_Stop
     */
    const action = async function () {
        try {
            const pidPath = $path.join(config.getBoot().projectRoot, DEF.DATA_FILE_PID);
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
    res.realm = DEF.CLI_PREFIX;
    res.name = 'server-stop';
    res.desc = 'Stop the HTTP/1 server.';
    res.action = action;
    return res;
}

// finalize code components for this es6-module
Object.defineProperty(Factory, 'name', {value: `${NS}.${Factory.name}`});
