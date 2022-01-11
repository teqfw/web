/**
 * Backend representation on the front for transborder events.
 */

// noinspection JSClosureCompilerSyntax
/**
 * @implements TeqFw_Core_Shared_Api_Event_IBus
 * @deprecated use TeqFw_Web_Front_App_Event_Bus
 */
export default class TeqFw_Web_Front_App_Event_Embassy {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Core_Shared_App_Event_Bus} */
        const baseEventBus = spec['TeqFw_Core_Shared_App_Event_Bus$$']; // instance

        // MAIN FUNCTIONALITY
        Object.assign(this, baseEventBus); // new base instance for every current instance
    }
}
