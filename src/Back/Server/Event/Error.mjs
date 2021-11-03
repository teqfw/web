/**
 * Handler to process HTTP/1 'error' events.
 * (@see https://nodejs.org/api/net.html#event-error)
 *
 * @namespace TeqFw_Web_Back_Server_Event_Error
 */
// MODULE'S IMPORT

// MODULE'S VARS
const NS = 'TeqFw_Web_Back_Server_Event_Error';

// MODULE'S FUNCTIONS
/**
 * TeqFW DI factory function to create dependencies for the object.
 *
 * @param {TeqFw_Di_Shared_SpecProxy} spec
 * @return {TeqFw_Web_Back_Server_Event_Error.handle|function}
 * @constructor
 */
export default function (spec) {
    // EXTRACT DEPS
    /** @type {TeqFw_Core_Shared_Logger} */
    const logger = spec['TeqFw_Core_Shared_Logger$'];

    // DEFINE INNER FUNCTIONS
    /**
     * @param {Error} error
     * @returns {Promise<void>}
     * @memberOf TeqFw_Web_Back_Server_Event_Error
     */
    async function handle(error) {
        logger.error(JSON.stringify(error));
    }

    // COMPOSE RESULT
    Object.defineProperty(handle, 'name', {value: `${NS}.handle`});
    return handle;
}
