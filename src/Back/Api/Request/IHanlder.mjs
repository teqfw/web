/**
 * Interface for request handler.
 *
 * @namespace TeqFw_Web_Back_Api_Request_IHandler
 */

/**
 * Interface for request handling function.
 * @param {TeqFw_Web_Back_Api_Request_IContext} context
 * @returns {Promise<void>}
 * @interface
 * @memberOf TeqFw_Web_Back_Api_Request_IHandler
 */
async function handle(context) {}

/**
 * Interface for factory to create request handling function.
 * @interface
 * @memberOf TeqFw_Web_Back_Api_Request_IHandler
 */
export default class Factory {
    /**
     * @return {Promise<TeqFw_Web_Back_Api_Request_IHandler.handle>}
     */
    async create() {}
}
