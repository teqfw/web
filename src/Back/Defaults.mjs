/**
 * Plugin constants (hardcoded configuration) for backend code.
 */
export default class TeqFw_Web_Back_Defaults {

    CLI_PREFIX = 'web'; // prefix in CLI commands

    DATA_FILE_PID = './var/http1.pid'; // PID file to stop running server.
    DATA_SERVER_PORT = 3000;

    DESC_NODE = 'web'; // plugin's node in 'teqfw.json' & './cfg/local.json'

    FS_STATIC_ROOT = 'web'; // root folder for static resources in plugins

    HTTP_HEADER_STATUS = 'status';

    /** @type {TeqFw_Di_Back_Defaults} */
    MOD_DI;

    /** @type {TeqFw_Web_Shared_Defaults} */
    SHARED;

    constructor(spec) {
        // EXTRACT DEPS
        this.MOD_DI = spec['TeqFw_Di_Back_Defaults$'];
        this.SHARED = spec['TeqFw_Web_Shared_Defaults$'];

        // MAIN FUNCTIONALITY
        Object.freeze(this);
    }
}
