/**
 * Plugin constants (hardcoded configuration) for shared code.
 */
export default class TeqFw_Web_Shared_Defaults {

    CFG_APP = '/app';
    CFG_DI = '/di';

    EVENT_AUTHENTICATE = 'authenticate'; // SSE event name

    LOG_META_TYPE = 'type'; // log type in log metadata sent to logs monitor (TODO: move to log plugin)

    NAME = '@teqfw/web';

    /** @type {TeqFw_Core_Shared_Defaults} */
    MOD_CORE;

    // URL prefix for API requests: https://.../door/space/...
    SPACE_CFG = 'cfg'; // configuration data (namespaces for DI, etc)
    SPACE_EVENT_DIRECT = 'efb'; // events stream from front to back
    SPACE_EVENT_REVERSE = 'ebf'; // events stream from back to front
    SPACE_SRC = 'src'; // sources from 'node_modules'
    SPACE_UPLOAD = 'upload';
    SPACE_WEB = 'web';

    // TODO: set dev 64 sec to prod 16 sec.
    TIMEOUT_EVENT_RESPONSE = 64000; // default timeout for response event (sent from back as answer to request from front)

    constructor(spec) {
        this.MOD_CORE = spec['TeqFw_Core_Shared_Defaults$'];
        Object.freeze(this);
    }
}
