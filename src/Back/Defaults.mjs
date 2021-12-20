/**
 * Plugin constants (hardcoded configuration) for backend code.
 */
export default class TeqFw_Web_Back_Defaults {

    AREA = 'front'; // DI area for frontend
    CLI_PREFIX = 'web'; // prefix in CLI commands

    DATA_DIR_UPLOAD = './var/store/upload/'; // folder to save uploaded files.
    DATA_FILE_PID = './var/web-server.pid'; // PID file to stop running server.
    DATA_SERVER_PORT = 8080;

    FS_STATIC_ROOT = 'web'; // root folder for static resources in plugins

    /** @type {TeqFw_Di_Back_Defaults} */
    MOD_DI;

    REQ_BODY = 'teqBody'; // request body as text
    REQ_BODY_JSON = 'teqBodyJson'; // request body as JSON object
    RES_BODY = 'teqBody'; // response body as text
    RES_FILE = 'teqFile'; // file name to be send as response
    RES_STATUS = 'teqStatus'; // HTTP status for response (if request is processed by handler)

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
