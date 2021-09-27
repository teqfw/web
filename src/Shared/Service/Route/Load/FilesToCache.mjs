/**
 * Route data for service to load list of files to be cached on the front by service worker.
 *
 * @namespace TeqFw_Web_Shared_Service_Route_Load_FilesToCache
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Shared_Service_Route_Load_FilesToCache';

// MODULE'S CLASSES
/**
 * @memberOf TeqFw_Web_Shared_Service_Route_Load_FilesToCache
 */
export class Request {}

/**
 * @memberOf TeqFw_Web_Shared_Service_Route_Load_FilesToCache
 */
export class Response {
    /** @type {string[]} */
    items;
}

/**
 * Factory to create new DTOs.
 * @memberOf TeqFw_Web_Shared_Service_Route_Load_FilesToCache
 * @implements TeqFw_Web_Back_Api_Service_IRoute
 */
export class Factory {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Web_Shared_Defaults} */
        const DEF = spec['TeqFw_Web_Shared_Defaults$'];

        // DEFINE INSTANCE METHODS
        /**
         * @param {Request|Object|null} data
         * @return {TeqFw_Web_Shared_Service_Route_Load_FilesToCache.Request}
         */
        this.createReq = function (data = null) {
            return new Request();
        }

        /**
         * @param {Response|Object|null} data
         * @return {TeqFw_Web_Shared_Service_Route_Load_FilesToCache.Response}
         */
        this.createRes = function (data = null) {
            const res = new Response();
            res.items = Array.isArray(data?.items) ? [...data.items] : [];
            return res;
        }

        this.getRoute = () => `/${DEF.NAME}${DEF.WEB_LOAD_FILES_TO_CACHE}`;
    }

}

// finalize code components for this es6-module
Object.defineProperty(Factory, 'name', {value: `${NS}.${Factory.constructor.name}`});
Object.defineProperty(Request, 'name', {value: `${NS}.${Request.constructor.name}`});
Object.defineProperty(Response, 'name', {value: `${NS}.${Response.constructor.name}`});
