/**
 * Plugin constants (hardcoded configuration) for shared code.
 */
export default class TeqFw_Web_Shared_Defaults {
    NAME = '@teqfw/web';

    SRV = {
        LOAD: {
            CONFIG: '/load/config',
            NAMESPACES: '/load/namespaces',
        }
    };

    /**
     * @deprecated
     * @type {string}
     */
    REALM = 'web';

    SPACE = { // URL prefix for API requests: https://.../door/space/...
        API: 'api',
        SRC: 'src',
        WEB: 'web',
    };

    constructor() {
        // EXTRACT DEPS

        // MAIN FUNCTIONALITY
        Object.freeze(this);
    }
}
