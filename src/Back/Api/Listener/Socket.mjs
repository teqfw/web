/**
 * Interface for web socket handlers used by `TeqFw_Web_Back_App_Server_Listener_Socket`.
 *
 * These handlers are used by listener to process web socket connections.
 *
 * @interface
 */
export default class TeqFw_Web_Back_Api_Listener_Socket {
    /**
     * Return 'true' if handler considers it should process the request.
     *
     * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest} req
     * @returns {boolean}
     */
    canProcess(req) {}

    /**
     * Initialize working environment for processor (config, loading, ...).
     * @returns {Promise<void>}
     */
    async init() { }

    /**
     * Prepare web socket before processing the connection.
     *
     * @param {WebSocket} ws
     * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest} req
     * @returns {WebSocket}
     */
    prepareSocket(ws, req) {}

    /**
     * Process one socket connection.
     * @param {WebSocket} ws
     * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest} req
     */
    process(ws, req) { }
}
