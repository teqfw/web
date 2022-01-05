/**
 * Frontend representation on the back for transborder events.
 */

// noinspection JSClosureCompilerSyntax
/**
 * @implements TeqFw_Core_Shared_Api_Event_IProducer
 */
export default class TeqFw_Web_Back_App_Server_Handler_Event_Embassy {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Core_Shared_App_Event_Producer} */
        const baseProducer = spec['TeqFw_Core_Shared_App_Event_Producer$$']; // instance

        // MAIN FUNCTIONALITY
        Object.assign(this, baseProducer); // new base instance for every current instance
    }
}
