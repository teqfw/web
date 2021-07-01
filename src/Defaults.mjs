/**
 * Application level constants (hardcoded configuration).
 */
export default class TeqFw_Web_Defaults {
    DATA = {
        FILE_PID_HTTP1: './var/http1.pid', // PID file to stop running server.
        FILE_PID_HTTP2: './var/http2.pid', // PID file to stop running server.
        SERVER_PORT: 3000,
    };

    FS_STATIC_ROOT = 'web'; // root folder for static resources in plugins

    HTTP = {
        HEADER: {STATUS: 'status'}
    };

    MOD = {
        /** @type {TeqFw_Core_Defaults} */
        CORE: null
    };

    REALM = 'web';

    SPACE = { // URL prefix for API requests: https://.../door/space/...
        API: 'api',
        SRC: 'src',
        WEB: 'web',
    };

    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Core_Defaults} */
        this.MOD.CORE = spec['TeqFw_Core_Defaults$'];

        // MAIN FUNCTIONALITY
        Object.freeze(this);
    }
}
