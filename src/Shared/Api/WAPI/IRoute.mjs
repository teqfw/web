/**
 * Interface for factory to serve route needs: create requests and responses DTOs and get route's address.
 * @interface
 * @deprecated use TeqFw_Web_Api_Shared_Api_IEndpoint
 */
export default class TeqFw_Web_Shared_Api_WAPI_IRoute {
    /**
     * @param {Object|null} data
     * @return {Object}
     */
    createReq(data = null) {}

    /**
     * @param {Object|null} data
     * @return {Object}
     */
    createRes(data = null) {}

    /**
     * Get route to the service inside plugin's realm.
     * @return {string}
     */
    getRoute() {}
}
