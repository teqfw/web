/**
 * Interface for service context.
 * All plugins services use this context to interchange data with HTTP-server (and, through the server, with clients).
 *
 * @interface
 */
export default class TeqFw_Web_Back_Api_Service_IContext {
    /**
     * Get service input data extracted from the POSTed JSON.
     * @return {Object}
     */
    getInData() {}

    /**
     * Get service output data to be send as JSON in the response.
     * @return {Object}
     */
    getOutData() {}

    /**
     * Get service output headers to be send in response.
     * @return {Object<string, string>}
     */
    getOutHeaders() {}

    /**
     * Get context for current request.
     * @return TeqFw_Web_Back_Api_Request_IContext
     */
    getRequestContext() {}

    /**
     * Set service input data extracted from the POSTed JSON.
     * @param {Object} data
     */
    setInData(data) {}

    /**
     * Set service output data to be send as JSON in the response.
     * @param {Object} data
     */
    setOutData(data) {}

    /**
     * Add/replace one header to be send in the response.
     * @param {string} key
     * @param {string} value
     */
    setOutHeader(key, value) {}

    /**
     * Set context to current request.
     * @param {TeqFw_Web_Back_Api_Request_IContext} data
     */
    setRequestContext(data) {}
}
/**
 * Factory to create new instances.
 * @memberOf TeqFw_Web_Back_Api_Service_IContext
 */
export class Factory {
    /**
     * @return {TeqFw_Web_Back_Api_Service_IContext}
     */
    create() {}
}
