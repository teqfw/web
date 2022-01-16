/**
 * Route data for service to load app configuration to the front.
 *
 * @namespace TeqFw_Web_Shared_WAPI_Load_Config
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Shared_WAPI_Load_Config';

// MODULE'S CLASSES
/**
 * @memberOf TeqFw_Web_Shared_WAPI_Load_Config
 */
export class Request {}

/**
 * This response contains unstructured data.
 * @memberOf TeqFw_Web_Shared_WAPI_Load_Config
 */
export class Response {}

/**
 * Factory to create new DTOs and get route address.
 * @memberOf TeqFw_Web_Shared_WAPI_Load_Config
 * @implements TeqFw_Web_Back_Api_WAPI_IRoute
 */
export class Factory {
    static namespace = NS;

    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Web_Shared_Defaults} */
        const DEF = spec['TeqFw_Web_Shared_Defaults$'];

        // DEFINE INSTANCE METHODS
        this.getRoute = () => `/${DEF.NAME}${DEF.WEB_LOAD_CONFIG}`;

        /**
         * @param {Request|Object|null} data
         * @return {TeqFw_Web_Shared_WAPI_Load_Config.Request}
         */
        this.createReq = function (data = null) {
            return new Request();
        }

        /**
         * This response contains unstructured data.
         * @param {Response|Object|null} data
         * @return {TeqFw_Web_Shared_WAPI_Load_Config.Response}
         */
        this.createRes = function (data = null) {
            return Object.assign(new Response(), data);
        }
    }

}

// finalize code components for this es6-module
Object.defineProperty(Request, 'name', {value: `${NS}.${Request.constructor.name}`});
Object.defineProperty(Response, 'name', {value: `${NS}.${Response.constructor.name}`});
