// @ts-check

/**
 * @namespace TeqFw_Web_Back_Api_Handler
 * @description Interface for web request handlers used by the Pipeline Engine.
 * @interface
 */
export default class Handler {
    /**
     * Handles one request context in a pipeline stage.
     * @param {TeqFw_Web_Back_Dto_RequestContext} _context
     * @returns {Promise<void>}
     */
    async handle(_context) {
        throw new Error('Method not implemented');
    }

    /**
     * Provides metadata for pipeline registration.
     * @returns {TeqFw_Web_Back_Dto_Info}
     */
    getRegistrationInfo() {
        throw new Error('Method not implemented');
    }
}
