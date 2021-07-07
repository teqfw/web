/**
 * Plugin constants (hardcoded configuration) for backend code.
 */
export default class TeqFw_Web_Back_Defaults {

    CLI_PREFIX = 'web'; // prefix in CLI commands

    DATA_FILE_PID = './var/http1.pid'; // PID file to stop running server.
    DATA_SERVER_PORT = 3000;

    DESC_NODE = 'web'; // node in 'teqfw.json' descriptors

    FS_STATIC_ROOT = 'web'; // root folder for static resources in plugins

    HTTP_HEADER_STATUS = 'status';


    /** @type {TeqFw_Web_Shared_Defaults} */
    SHARED;

    constructor(spec) {
        // EXTRACT DEPS
        this.SHARED = spec['TeqFw_Web_Shared_Defaults$'];

        // MAIN FUNCTIONALITY
        Object.freeze(this);
    }
}
