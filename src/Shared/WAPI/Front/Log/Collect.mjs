/**
 * Route data for service to collect logs from fronts.
 *
 * @namespace TeqFw_Web_Shared_WAPI_Front_Log_Collect
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Shared_WAPI_Front_Log_Collect';

// MODULE'S CLASSES
/**
 * @memberOf TeqFw_Web_Shared_WAPI_Front_Log_Collect
 */
export class Request {
    /** @type {TeqFw_Core_Shared_Dto_Log.Dto} */
    item;
}

/**
 * @memberOf TeqFw_Web_Shared_WAPI_Front_Log_Collect
 */
export class Response {
    /** @type {boolean} */
    success;
}

/**
 * Factory to create new DTOs.
 * @memberOf TeqFw_Web_Shared_WAPI_Front_Log_Collect
 * @implements TeqFw_Web_Shared_Api_WAPI_IRoute
 */
export class Factory {
    static namespace = NS;

    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Web_Shared_Defaults} */
        const DEF = spec['TeqFw_Web_Shared_Defaults$'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castBoolean|function} */
        const castBoolean = spec['TeqFw_Core_Shared_Util_Cast.castBoolean'];
        /** @type {TeqFw_Core_Shared_Dto_Log} */
        const dtoLog = spec['TeqFw_Core_Shared_Dto_Log$'];

        // INSTANCE METHODS
        /**
         * @param {Request|Object|null} data
         * @return {TeqFw_Web_Shared_WAPI_Front_Log_Collect.Request}
         */
        this.createReq = function (data = null) {
            const res = new Request();
            res.item = dtoLog.createDto(data?.item);
            return res;
        }

        /**
         * @param {Response|null} data
         * @return {TeqFw_Web_Shared_WAPI_Front_Log_Collect.Response}
         */
        this.createRes = function (data = null) {
            const res = new Response();
            res.success = castBoolean(data?.success);
            return res;
        }

        this.getRoute = () => `/${DEF.NAME}${DEF.WAPI_FRONT_LOG_COLLECT}`;
    }

}

// finalize code components for this es6-module
Object.defineProperty(Request, 'namespace', {value: `${NS}.Request`});
Object.defineProperty(Response, 'namespace', {value: `${NS}.Response`});
