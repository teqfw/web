/**
 * Plugin constants (hardcoded configuration) for backend code.
 */
export default class TeqFw_Web_Back_Defaults {
    DATA = {
        FILE_PID_HTTP1: './var/http1.pid', // PID file to stop running server.
        FILE_PID_HTTP2: './var/http2.pid', // PID file to stop running server.
        SERVER_PORT: 3000,
    };

    FS_STATIC_ROOT = 'web'; // root folder for static resources in plugins

    HTTP = {
        HEADER: {STATUS: 'status'}
    };

    REALM = 'web';

    /** @type {TeqFw_Web_Shared_Defaults} */
    SHARED = null;

    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Web_Shared_Defaults} */
        this.SHARED = spec['TeqFw_Web_Shared_Defaults$'];

        // MAIN FUNCTIONALITY
        Object.freeze(this);
    }
}
