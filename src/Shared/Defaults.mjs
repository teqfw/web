/**
 * Plugin constants (hardcoded configuration) for shared code.
 */
export default class TeqFw_Web_Shared_Defaults {

    NAME = '@teqfw/web';

    // URL prefix for API requests: https://.../door/space/...
    SPACE_API = 'api';
    SPACE_SRC = 'src';
    SPACE_WEB = 'web';

    WEB_LOAD_CONFIG = '/load/config';
    WEB_LOAD_NAMESPACES = '/load/namespaces';

    constructor() {
        Object.freeze(this);
    }
}
