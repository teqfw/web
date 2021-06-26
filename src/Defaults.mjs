/**
 * Application level constants (hardcoded configuration).
 */
export default class TeqFw_Web_Defaults {
    BACK_REALM = 'web';

    MOD = {
        /** @type {TeqFw_Core_Defaults} */
        CORE: null
    };

    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Core_Defaults} */
        this.MOD.CORE = spec['TeqFw_Core_Defaults$']; // singleton

        // MAIN FUNCTIONALITY
        Object.freeze(this);
    }
}
