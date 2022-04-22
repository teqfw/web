/**
 * Plugin constants (hardcoded configuration) for shared code.
 */
export default class TeqFw_Web_Shared_Defaults {

    CFG_APP = '/app';
    CFG_DI = '/di';

    LOG_META_TYPE = 'type'; // log type in log metadata sent to logs monitor (TODO: move to log plugin)

    NAME = '@teqfw/web';

    /** @type {TeqFw_Core_Shared_Defaults} */
    MOD_CORE;

    // URL prefix for API requests: https://.../door/space/...
    SPACE_CFG = 'cfg'; // configuration data (namespaces for DI, etc)
    SPACE_SRC = 'src'; // sources from 'node_modules'
    SPACE_UPLOAD = 'upload';
    SPACE_WEB = 'web';

    constructor(spec) {
        this.MOD_CORE = spec['TeqFw_Core_Shared_Defaults$'];
        Object.freeze(this);
    }
}
