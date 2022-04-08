/**
 * Interface for service factory used in 'TeqFw_Web_Back_Plugin_Web_Handler_Service'.
 * @interface
 * @deprecated use TeqFw_Web_Api_Back_Api_Factory_IService
 */
export default class TeqFw_Web_Back_Api_WAPI_IFactory {
    /**
     * Get factory to compose route data (address & DTO for request & response).
     * @return {TeqFw_Web_Shared_Api_WAPI_IRoute}
     */
    getRouteFactory() {}

    /**
     * Get service function.
     * @return {function(TeqFw_Web_Back_App_Server_Handler_WAPI_Context): Promise<void>}
     */
    getService() {}
}
