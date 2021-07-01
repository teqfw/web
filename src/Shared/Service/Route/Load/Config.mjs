/**
 * Route data for service to load app configuration to the front.
 *
 * @namespace TeqFw_Web_Shared_Service_Route_Load_Config
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Shared_Service_Route_Load_Config';

// MODULE'S CLASSES
/**
 * @memberOf TeqFw_Web_Shared_Service_Route_Load_Config
 */
class Request {}

/**
 * This response contains unstructured data.
 *
 * @memberOf TeqFw_Web_Shared_Service_Route_Load_Config
 */
class Response {}

/**
 * Factory to create new DTOs.
 * @memberOf TeqFw_Web_Shared_Service_Route_Load_Config
 * @implements TeqFw_Web_Back_Api_Service_Factory_IRoute
 */
class Factory {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Web_Shared_Defaults} */
        const DEF = spec['TeqFw_Web_Shared_Defaults$'];

        // DEFINE INSTANCE METHODS
        /**
         * @param {Request|Object|null} data
         * @return {TeqFw_Web_Shared_Service_Route_Load_Config.Request}
         */
        this.createReq = function (data = null) {
            return new Request();
        }

        /**
         * @param {Response|Object|null} data
         * @return {TeqFw_Web_Shared_Service_Route_Load_Config.Response}
         */
        this.createRes = function (data = null) {
            return new Response();
        }

        this.getRoute = () => DEF.API.LOAD.CONFIG;
    }

}

// MODULE'S EXPORT
Object.defineProperty(Factory, 'name', {value: `${NS}.${Factory.constructor.name}`});
Object.defineProperty(Request, 'name', {value: `${NS}.${Request.constructor.name}`});
Object.defineProperty(Response, 'name', {value: `${NS}.${Response.constructor.name}`});
export {
    Factory,
    Request,
    Response,
};
