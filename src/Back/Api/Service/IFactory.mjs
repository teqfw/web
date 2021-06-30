/**
 * Interface for service factory used in 'TeqFw_Web_Plugin_Web_Handler_Service'.
 * @interface
 */
export default class TeqFw_Web_Back_Api_Service_IFactory {
    /** @return {TeqFw_Web_Back_Api_Service_Factory_IReqRes} */
    getDtoFactory() {}

    /** @return {string} */
    getRoute() {}

    /**
     * Get service function.
     * @return {function(TeqFw_Web_Back_Api_Service_IContext)}
     */
    getService() {}
}
