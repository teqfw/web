/**
 * Backend representation on the front for transborder events.
 */

// noinspection JSClosureCompilerSyntax
/**
 * @implements TeqFw_Core_Shared_Api_Event_IProducer
 */
export default class TeqFw_Web_Front_App_Event_Embassy {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Core_Shared_Mod_Event_Producer} */
        const baseProducer = spec['TeqFw_Core_Shared_Mod_Event_Producer$$']; // instance

        // MAIN FUNCTIONALITY
        Object.assign(this, baseProducer); // new base instance for every current instance
    }
}
