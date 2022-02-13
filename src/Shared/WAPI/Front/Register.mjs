/**
 * Route data for service to register newly installed front on server.
 *
 * @namespace TeqFw_Web_Shared_WAPI_Front_Register
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Shared_WAPI_Front_Register';

// MODULE'S CLASSES
/**
 * @memberOf TeqFw_Web_Shared_WAPI_Front_Register
 */
export class Request {
    /** @type {string} */
    publicKey;
    /** @type {string} */
    uuid;
}

/**
 * @memberOf TeqFw_Web_Shared_WAPI_Front_Register
 */
export class Response {
    /** @type {number} */
    frontId;
}

/**
 * Factory to create new DTOs.
 * @memberOf TeqFw_Web_Shared_WAPI_Front_Register
 * @implements TeqFw_Web_Shared_Api_WAPI_IRoute
 */
export class Factory {
    static namespace = NS;

    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Web_Shared_Defaults} */
        const DEF = spec['TeqFw_Web_Shared_Defaults$'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castInt|function} */
        const castInt = spec['TeqFw_Core_Shared_Util_Cast.castInt'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];

        // INSTANCE METHODS
        /**
         * @param {Request|Object|null} data
         * @return {TeqFw_Web_Shared_WAPI_Front_Register.Request}
         */
        this.createReq = function (data = null) {
            const res = new Request();
            res.publicKey = castString(data?.publicKey);
            res.uuid = castString(data?.uuid);
            return res;
        }

        /**
         * @param {Response|null} data
         * @return {TeqFw_Web_Shared_WAPI_Front_Register.Response}
         */
        this.createRes = function (data = null) {
            const res = new Response();
            res.frontId = castInt(data?.frontId);
            return res;
        }

        this.getRoute = () => `/${DEF.NAME}${DEF.WAPI_FRONT_REGISTER}`;
    }

}

// finalize code components for this es6-module
Object.defineProperty(Request, 'namespace', {value: `${NS}.Request`});
Object.defineProperty(Response, 'namespace', {value: `${NS}.Response`});
