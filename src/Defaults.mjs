/**
 * Application level constants (hardcoded configuration).
 */
export default class TeqFw_Plugin_Defaults {
    BACK_REALM = 'plugin';  // realm for API services ('/api/project/...') and CLI commands ('project-...')

    /** @type {TeqFw_Core_App_Defaults} */
    MOD_CORE;

    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Core_App_Defaults} */
        this.MOD_CORE = spec['TeqFw_Core_App_Defaults$']; // instance singleton

        // MAIN FUNCTIONALITY
        Object.freeze(this);
    }
}
