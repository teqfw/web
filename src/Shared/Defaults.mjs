/**
 * Plugin constants (hardcoded configuration) for shared code.
 */
export default class TeqFw_Web_Shared_Defaults {

    CFG_APP = '/app'; // front app configuration
    CFG_DI = '/di'; // DI configuration for the front
    CFG_SW_CACHE = '/sw_cache'; // files to be cached on the front by service worker

    LOG_META_TYPE = 'type'; // log type in log metadata sent to logs monitor (TODO: move to log plugin)

    NAME = '@teqfw/web';

    /** @type {TeqFw_Core_Shared_Defaults} */
    MOD_CORE;

    // URL prefix for API requests: https://.../door/space/...
    SPACE_CFG = 'cfg'; // configuration data (namespaces for DI, etc)
    SPACE_SRC = 'src'; // sources from 'node_modules' as statics
    SPACE_UPLOAD = 'upload'; // TODO: move to standalone plugin
    SPACE_WEB = 'web'; // sources from './web/' folder as statics

    constructor(spec) {
        this.MOD_CORE = spec['TeqFw_Core_Shared_Defaults$'];
        Object.freeze(this);
    }
}
