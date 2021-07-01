/**
 * Plugin constants (hardcoded configuration) for frontend code.
 */
export default class TeqFw_Web_Front_Defaults {

    /** @type {TeqFw_Web_Shared_Defaults} */
    SHARED = null;

    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Web_Shared_Defaults} */
        this.SHARED = spec['TeqFw_Web_Shared_Defaults$'];

        // MAIN FUNCTIONALITY
        Object.freeze(this);
    }
}
