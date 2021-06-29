/**
 * Interface for request context used in 'TeqFw_Web_Back_Http1_Request_Processor'.
 * @interface
 */
export default class TeqFw_Web_Back_Api_Request_IContext {
    /**
     * Get object that is shared between all handlers.
     * @return {Object}
     */
    getHandlersShare() {}

    /** @return {string} */
    getResponseBody() {}

    /**
     * Get path to file to return in response.
     * @return {string}
     */
    getResponseFilePath() {}

    /** @return {Object<string, string>} */
    getResponseHeaders() {}

    /**
     * 'true' - if some handler completely processed request.
     * This is secondary case for processing (Request Processor should send response by itself).
     * @return {boolean}
     */
    isRequestComplete() {}

    /**
     * 'true' - if some handler prepared response data (headers, body or file name) but didn't sent data to client.
     * This is primary case for processing - Request Processor send response by itself.
     * @return {boolean}
     */
    isRequestProcessed() {}

    /**
     * Save current request data to context.
     * @param {Object} data
     */
    setRequestContext(data) {}
}
