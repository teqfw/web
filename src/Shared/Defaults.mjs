/**
 * Plugin constants (hardcoded configuration) for shared code.
 */
export default class TeqFw_Web_Shared_Defaults {
    NAME = '@teqfw/web';

    /**
     * Used in CLI commands and 'teqfw.json' descriptors.
     * @type {string}
     * TODO: move to back DEFs
     */
    REALM = 'web';

    SPACE = { // URL prefix for API requests: https://.../door/space/...
        API: 'api',
        SRC: 'src',
        WEB: 'web',
    };

    SRV = {
        LOAD: {
            CONFIG: '/load/config',
            NAMESPACES: '/load/namespaces',
        }
    };

    constructor() {
        Object.freeze(this);
    }
}
