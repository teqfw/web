/**
 * Model to represent context for plugins services.
 * All plugins' services use this context to interchange data with HTTP-server (and, through the server, with clients).
 * TODO: it's not a DTO, we should pass HTTP-request data to constructor
 * TODO: move class fields to constructor (they are public now)
 * @namespace TeqFw_Web_Back_Api_WAPI_Context
 */
// MODULE'S IMPORT
import {constants as H2} from 'http2';

// MODULE'S VARS
const NS = 'TeqFw_Web_Back_Api_WAPI_Context';

export default class TeqFw_Web_Back_Api_WAPI_Context {
    /** @type {TeqFw_Core_Shared_Mod_Map} */
    handlersShare;
    /** @type {module:http.IncomingMessage|module:http2.Http2ServerRequest} */
    httpRequest;
    /** @type {Object} */
    inData;
    /** @type {Object} */
    outData;
    /** @type {Object<string, string>} */
    outHeaders;
    /** @type {{string, string}} */
    routeParams;

    /**
     * Get objects registry that is shared between all handlers.
     * @return {TeqFw_Core_Shared_Mod_Map}
     */
    getHandlersShare() {
        return this.handlersShare;
    }

    /**
     * Get service input data extracted from the POSTed JSON.
     * @return {Object}
     */
    getInData() {
        return this.inData;
    }

    /**
     * Get service output data to be send as JSON in the response.
     * @return {Object}
     */
    getOutData() {
        return this.outData;
    }

    /**
     * Get service output headers to be send in response.
     * @return {Object<string, string>}
     */
    getOutHeaders() {
        return this.outHeaders;
    }

    /**
     * Get HTTP request url (/root/door/space/route).
     * @return {string} data
     */
    getRequestUrl() {
        return this.httpRequest.url;
    }

    /**
     * Get params for route (/post/:postId/comment/:commentId).
     * @return {{string, string}} data
     */
    getRouteParams() {
        return this.routeParams;
    }

    /**
     * Set context to current request.
     * @param {TeqFw_Core_Shared_Mod_Map} data
     */
    setHandlersShare(data) {
        this.handlersShare = data;
    }

    /**
     * Set service input data extracted from the POSTed JSON.
     * @param {Object} data
     */
    setInData(data) {
        this.inData = data;
    }

    /**
     * Set service output data to be sent as JSON in the response.
     * @param {Object} data
     */
    setOutData(data) {
        this.outData = data;
    }

    /**
     * Add/replace one header to be sent in the response.
     * @param {string} key
     * @param {string} value
     */
    setOutHeader(key, value) {
        if (key === H2.HTTP2_HEADER_SET_COOKIE) {
            if (this.outHeaders[key]) {
                // merge cookies
                this.outHeaders[key] += `;${value}`;
            } else {
                // add cookie
                this.outHeaders[key] = value;
            }
        } else {
            this.outHeaders[key] = value;
        }
    }

    /**
     * Set HTTP request data.
     * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest}req
     */
    setHttpRequest(req) {
        this.httpRequest = req;
    }

    /**
     * Set params for route (/post/:postId/comment/:commentId).
     * @param {{string, string}} data
     */
    setRouteParams(data) {
        this.routeParams = data;
    }
}

/**
 * Factory to create new instances.
 * @memberOf TeqFw_Web_Back_Api_WAPI_Context
 */
export class Factory {
    /**
     * @param {TeqFw_Web_Back_Api_WAPI_Context|null} data
     * @return {TeqFw_Web_Back_Api_WAPI_Context}
     */
    create(data = null) {
        const res = new TeqFw_Web_Back_Api_WAPI_Context();
        res.inData = data?.inData;
        res.outData = data?.outData;
        res.outHeaders = data?.outHeaders ?? {};
        res.handlersShare = data?.handlersShare;
        res.routeParams = data?.routeParams ?? {};
        return res;
    }
}

// finalize code components for this es6-module
Object.defineProperty(Factory, 'name', {value: `${NS}.${Factory.constructor.name}`});
