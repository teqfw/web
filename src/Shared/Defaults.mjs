/**
 * Plugin constants (hardcoded configuration) for shared code.
 */
export default class TeqFw_Web_Shared_Defaults {

    /** @type {TeqFw_Core_Shared_Defaults} */
    MOD_CORE;

    NAME = '@teqfw/web';

    // URL prefix for API requests: https://.../door/space/...
    SPACE_API = 'api';
    SPACE_SRC = 'src';
    SPACE_WEB = 'web';

    WEB_LOAD_CONFIG = '/load/config';
    WEB_LOAD_NAMESPACES = '/load/namespaces';
    WEB_LOAD_FILES_TO_CACHE = '/load/files_to_cache';

    constructor(spec) {
        this.MOD_CORE = spec['TeqFw_Core_Shared_Defaults$'];
        Object.freeze(this);
    }
}
