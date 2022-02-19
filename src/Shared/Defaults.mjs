/**
 * Plugin constants (hardcoded configuration) for shared code.
 */
export default class TeqFw_Web_Shared_Defaults {

    EVENT_AUTHENTICATE = 'authenticate'; // SSE event name

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

    // TODO: set dev 64 sec to prod 16 sec.
    TIMEOUT_EVENT_RESPONSE = 64000; // default timeout for response event (sent from back as answer to request from front)

    WAPI_ALIVE = '/alive';
    WAPI_FRONT_REGISTER = '/front/register';
    WAPI_FRONT_LOG_COLLECT = '/front/log/collect';
    WAPI_LOAD_CONFIG = '/load/config';
    WAPI_LOAD_FILES_TO_CACHE = '/load/files_to_cache';
    WAPI_LOAD_NAMESPACES = '/load/namespaces';

    constructor(spec) {
        this.MOD_CORE = spec['TeqFw_Core_Shared_Defaults$'];
        Object.freeze(this);
    }
}
