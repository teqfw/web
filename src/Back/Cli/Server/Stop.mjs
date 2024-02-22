/**
 * Stop web server.
 * @namespace TeqFw_Web_Back_Cli_Server_Stop
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Back_Cli_Server_Stop';

// MODULE'S FUNCS
/**
 * Factory to create CLI command.
 *
 * @param {TeqFw_Web_Back_Defaults} DEF
 * @param {TeqFw_Core_Back_App} app
 * @param {TeqFw_Core_Back_Api_Dto_Command.Factory} fCommand
 * @param {TeqFw_Core_Back_Mod_App_Pid} modPid
 * @returns {TeqFw_Core_Back_Api_Dto_Command}
 * @memberOf TeqFw_Web_Back_Cli_Server_Stop
 */
export default function Factory(
    {
        TeqFw_Web_Back_Defaults$: DEF,
        TeqFw_Core_Back_App$: app,
        ['TeqFw_Core_Back_Api_Dto_Command.Factory$']: fCommand,
        TeqFw_Core_Back_Mod_App_Pid$: modPid,
    }) {
    // FUNCS
    /**
     * Stop previously started web server (using PID file).
     * @returns {Promise<void>}
     * @memberOf TeqFw_Web_Back_Cli_Server_Stop
     */
    const action = async function () {
        // get PID and stop previously started process (web-server-start)
        const pid = await modPid.readPid(DEF.DATA_FILE_PID);
        if (pid) modPid.stop(pid);
        // stop current process (web-server-stop)
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
