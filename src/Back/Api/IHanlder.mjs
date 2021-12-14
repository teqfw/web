/**
 * Interface for web server request handlers.
 * These handlers are used by `TeqFw_Web_Back_Server_Scan_Handler.act`.
 *
 * @interface
 */
export default class TeqFw_Web_Back_Api_IHandler {
    /**
     * Create all listeners used by handler.
     * @return {Promise<void>}
     */
    async createListeners() {}

    /**
     * Get listener for the event.
     * @param {string} event
     * @return {function}
     */
    getListener(event) {}
}
