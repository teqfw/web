/**
 * Interface for request context used in 'TeqFw_Web_Back_Server_Request_Processor'.
 * @interface
 */
export default class TeqFw_Web_Back_Api_Request_IContext {
    /**
     * Get object that is shared between all handlers.
     * @return {Object}
     */
    getHandlersShare() {}

    /**
     * Get request data been read from input stream.
     * @return {Buffer[]}
     */
    getInputData() {}

    /**
     * Get requested path (/root/door/space/route).
     * @returns {string}
     */
    getPath() {}

    /** @return {Object<string, string>} */
    getRequestHeaders() {}

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
     * Set 'Request Complete' flag in request context.
     */
    markRequestComplete() {}

    /**
     * Set 'Request Processed' flag in request context.
     */
    markRequestProcessed() {}

    /**
     * Set request data been read from input stream to context.
     * @param {Buffer[]} chunks
     */
    setInputData(chunks) {}

    /**
     * Save current request data to context.
     * @param {Object} data
     */
    setRequestContext(data) {}

    /**
     * Set response body as string.
     * @param {string} data
     */
    setResponseBody(data) {}

    /**
     * Set path to file to return in response.
     * @param {string} path
     */
    setResponseFilePath(path) {}

    /**
     * Add/replace response headers.
     * @param {string} key
     * @param {string} value
     */
    setResponseHeader(key, value) {}
}

/**
 * Factory to create new context for web request.
 * @interface
 * @memberOf TeqFw_Web_Back_Api_Request_IContext
 */
export class Factory {
    /**
     * @return {TeqFw_Web_Back_Api_Request_IContext}
     */
    create() {}
}
