/**
 * Interface for web request handlers.
 *
 * These handlers are used by dispatcher to process HTTP request.
 *
 * @namespace TeqFw_Web_Back_Api_Dispatcher_IHandler
 * was: TeqFw_Web_Back_Api_Request_IHandler
 */

/**
 * @interface
 * TODO: rename _IName to _Name
 */
export default class TeqFw_Web_Back_Api_Dispatcher_IHandler {
    /**
     * Return 'true' if handler considers it should process the request.
     *
     * @param {string} method GET, POST, ...
     * @param {TeqFw_Web_Back_Dto_Address} address
     * @param {Object<string, string>} headers
     * @returns {boolean}
     */
    canProcess({method, address, headers} = {}) {}

    /**
     * Return processing function to handle single HTTP request.
     * @returns {(function((IncomingMessage|Http2ServerRequest), (ServerResponse|Http2ServerResponse)): Promise<void>)|*}
     */
    getProcessor() { }

    /**
     * Initialize working environment for processor (config, loading, ...).
     * @returns {Promise<void>}
     */
    async init() { }
}
