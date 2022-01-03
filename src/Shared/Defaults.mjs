/**
 * Plugin constants (hardcoded configuration) for shared code.
 */
export default class TeqFw_Web_Shared_Defaults {

    NAME = '@teqfw/web';

    /** @type {TeqFw_Core_Shared_Defaults} */
    MOD_CORE;

    // URL prefix for API requests: https://.../door/space/...
    SPACE_API = 'api';
    SPACE_EVENT_DIRECT = 'efb'; // events stream from front to back
    SPACE_EVENT_REVERSE = 'ebf'; // events stream from back to front
    SPACE_SRC = 'src';
    SPACE_SSE = 'sse';
    SPACE_UPLOAD = 'upload';
    SPACE_WEB = 'web';

    WEB_LOAD_CONFIG = '/load/config';
    WEB_LOAD_NAMESPACES = '/load/namespaces';
    WEB_LOAD_FILES_TO_CACHE = '/load/files_to_cache';

    constructor(spec) {
        this.MOD_CORE = spec['TeqFw_Core_Shared_Defaults$'];
        Object.freeze(this);
    }
}
