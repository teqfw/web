/**
 * Interface for web request handlers.
 *
 * These handlers are used by dispatcher to process HTTP request.
 *
 * @namespace TeqFw_Web_Back_Api_Dispatcher_IHandler
 */

/**
 * @interface
 */
export default class TeqFw_Web_Back_Api_Dispatcher_IHandler {
    /**
     * Return processing function to handle request.
     * @return {(function((IncomingMessage|Http2ServerRequest), (ServerResponse|Http2ServerResponse)): Promise<void>)|*}
     */
    getProcessor() { }

    /**
     * Initialize working environment for processor (config, loading, ...).
     * @return {Promise<void>}
     */
    async init() { }

    /**
     * Return 'true' if handler considers the request to be its.
     *
     * @param {string} method GET, POST, ...
     * @param {TeqFw_Web_Back_Dto_Address} address
     * @param {Object<string, string>} headers
     * @return {boolean}
     */
    requestIsMine({method, address, headers} = {}) {}
}
