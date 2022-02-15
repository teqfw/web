/**
 * Route data for service to load list of files to be cached on the front by service worker.
 *
 * @namespace TeqFw_Web_Shared_WAPI_Load_FilesToCache
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Shared_WAPI_Load_FilesToCache';

// MODULE'S CLASSES
/**
 * @memberOf TeqFw_Web_Shared_WAPI_Load_FilesToCache
 */
export class Request {
    /**
     * Door name to get statics for (entry point - 'pub', 'admin', ...).
     * @type {string}
     */
    door;
}

/**
 * @memberOf TeqFw_Web_Shared_WAPI_Load_FilesToCache
 */
export class Response {
    /** @type {string[]} */
    items;
}

/**
 * Factory to create new DTOs.
 * @memberOf TeqFw_Web_Shared_WAPI_Load_FilesToCache
 * @implements TeqFw_Web_Shared_Api_WAPI_IRoute
 */
export class Factory {
    static namespace = NS;

    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Web_Shared_Defaults} */
        const DEF = spec['TeqFw_Web_Shared_Defaults$'];
        const {castString} = spec['TeqFw_Core_Shared_Util_Cast'];

        // DEFINE INSTANCE METHODS
        /**
         * @param {Request|Object|null} data
         * @return {TeqFw_Web_Shared_WAPI_Load_FilesToCache.Request}
         */
        this.createReq = function (data = null) {
            const res = new Request();
            res.door = castString(data?.door);
            return res;
        }

        /**
         * @param {Response|Object|null} data
         * @return {TeqFw_Web_Shared_WAPI_Load_FilesToCache.Response}
         */
        this.createRes = function (data = null) {
            const res = new Response();
            res.items = Array.isArray(data?.items) ? [...data.items] : [];
            return res;
        }

        this.getRoute = () => `/${DEF.NAME}${DEF.WAPI_LOAD_FILES_TO_CACHE}`;
    }

}

// finalize code components for this es6-module
Object.defineProperty(Request, 'namespace', {value: `${NS}.Request`});
Object.defineProperty(Response, 'namespace', {value: `${NS}.Response`});
