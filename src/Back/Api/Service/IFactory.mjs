/**
 * Interface for service factory used in 'TeqFw_Web_Back_Plugin_Web_Handler_Service'.
 * @interface
 */
export default class TeqFw_Web_Back_Api_Service_IFactory {
    /**
     * Get factory compose route (address & DTO for request & response).
     * @return {TeqFw_Web_Back_Api_Service_IRoute}
     */
    getRouteFactory() {}

    /**
     * Get service function.
     * @return {function(TeqFw_Web_Back_Api_Service_Context): Promise<void>}
     */
    getService() {}
}
