/**
 * Plugin constants (hardcoded configuration) for frontend code.
 */
export default class TeqFw_Web_Front_Defaults {

    /** @type {TeqFw_Web_Shared_Defaults} */
    SHARED ;

    constructor(spec) {
        // DEPS
        this.SHARED = spec['TeqFw_Web_Shared_Defaults$'];

        // MAIN
        Object.freeze(this);
    }
}
