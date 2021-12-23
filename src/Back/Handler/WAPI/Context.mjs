/**
 * Model to represent context for WAPI-services defined in plugins.
 * All plugins' WAPI-services use this context to interchange data with HTTP-server (read request data and prepare
 * data for response).
 * It's not a typical DTO, we should pass HTTP-request data to constructor.
 *
 * @namespace TeqFw_Web_Back_Handler_WAPI_Context
 */
// MODULE'S IMPORT
import {constants as H2} from 'http2';

// MODULE'S VARS
const NS = 'TeqFw_Web_Back_Handler_WAPI_Context';

export default class TeqFw_Web_Back_Handler_WAPI_Context {
    /**
     * This is not DI compatible constructor. Use Factory class to create new instances.
     * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest} req
     * @param {Object<string, string>} params
     * @param {TeqFw_Core_Shared_Mod_Map} share
     * @param {Object|null} inStruct
     * @param {Object} outStruct
     */
    constructor(req, params, share, inStruct, outStruct) {

        // DEFINE WORKING VARS / PROPS
        /** @type {module:http.IncomingMessage|module:http2.Http2ServerRequest} */
        const httpRequest = req;
        /** @type {TeqFw_Core_Shared_Mod_Map} */
        const handlersShare = share;
        /** @type {Object} */
        const inData = inStruct;
        /** @type {Object} */
        const outData = outStruct;
        /** @type {Object<string, string>} */
        const outHeaders = {};
        /** @type {Object<string, string>} */
        const routeParams = params;

        // DEFINE INSTANCE METHODS

        /**
         * Get objects registry that is shared between all handlers.
         * @return {TeqFw_Core_Shared_Mod_Map}
         */
        this.getHandlersShare = () => handlersShare;

        /**
         * Get service input data extracted from the POSTed JSON.
         * @return {Object}
         */
        this.getInData = () => inData;

        /**
         * Get service output data to be send as JSON in the response.
         * @return {Object}
         */
        this.getOutData = () => outData;

        /**
         * Get service output headers to be send in response.
         * @return {Object<string, string>}
         */
        this.getOutHeaders = () => outHeaders;

        /**
         * Get HTTP request url (/root/door/space/route).
         * @return {string} data
         */
        this.getRequestUrl = () => httpRequest?.url;

        /**
         * Get params for route (/post/:postId/comment/:commentId).
         * @return {Object<string, string>} data
         */
        this.getRouteParams = () => routeParams;

        /**
         * Add/replace one header to be sent in the response.
         * @param {string} key
         * @param {string} value
         */
        this.setOutHeader = function (key, value) {
            if (key === H2.HTTP2_HEADER_SET_COOKIE) {
                if (outHeaders[key]) {
                    // merge cookies
                    outHeaders[key] += `;${value}`;
                } else {
                    // add cookie
                    outHeaders[key] = value;
                }
            } else {
                outHeaders[key] = value;
            }
        }
    }
}

/**
 * Factory to create new instances of context.
 * It is not a typical DTO factory.
 * @memberOf TeqFw_Web_Back_Handler_WAPI_Context
 */
export class Factory {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Web_Back_Defaults} */
        const DEF = spec['TeqFw_Web_Back_Defaults$'];

        // DEFINE INSTANCE METHODS
        /**
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest} req
         * @param {TeqFw_Web_Back_Api_WAPI_IRoute} route
         * @param {Object<string, string>} params
         * @return {TeqFw_Web_Back_Handler_WAPI_Context}
         */
        this.create = function (req, params, route) {
            const shares = req[DEF.HNDL_SHARE];
            const json = shares.get(DEF.SHARE_REQ_BODY_JSON);
            const inData = (json) ? route.createReq(json?.data) : null;
            const outData = route.createRes();
            return new TeqFw_Web_Back_Handler_WAPI_Context(req, params, shares, inData, outData);
        }
    }
}

// finalize code components for this es6-module
Object.defineProperty(Factory, 'name', {value: `${NS}.${Factory.constructor.name}`});
