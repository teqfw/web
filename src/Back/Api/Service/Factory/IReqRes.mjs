/**
 * Interface for factory to create requests and responses DTOs for API services.
 * @interface
 */
export default class TeqFw_Web_Back_Api_Service_Factory_IReqRes {
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
}
