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

    HNDL_SHARE = 'teqSharedObjects'; // attribute name for shared objects' registry in req/res structures

    /** @type {TeqFw_Core_Back_Defaults} */
    MOD_CORE;

    // key names for objects stored in shared objects' registry (related to processing of one HTTP request)
    SHARE_REQ_BODY;
    SHARE_REQ_BODY_JSON;
    SHARE_RES_BODY;
    SHARE_RES_FILE;
    SHARE_RES_STATUS;

    /** @type {TeqFw_Web_Shared_Defaults} */
    SHARED;

    /**
     * @param {TeqFw_Core_Back_Defaults} MOD_CORE
     * @param {TeqFw_Web_Shared_Defaults} SHARED
     */
    constructor(
        {
            TeqFw_Core_Back_Defaults$: MOD_CORE,
            TeqFw_Web_Shared_Defaults$: SHARED,
        }
    ) {
        // DEPS
        this.MOD_CORE = MOD_CORE;
        this.SHARED = SHARED;

        // MAIN
        // init props after dependencies was injected
        const ns = this.SHARED.NAME;
        this.SHARE_REQ_BODY = `${ns}/req/body`; // request body as text
        this.SHARE_REQ_BODY_JSON = `${ns}/req/body/json`; // request body as JSON object
        this.SHARE_RES_BODY = `${ns}/res/body`; // response body as text
        this.SHARE_RES_FILE = `${ns}/res/filename`; // name of the to be sent as response
        this.SHARE_RES_STATUS = `${ns}/res/status`; // HTTP status for response (if request is processed by handler)
        Object.freeze(this);
    }
}
