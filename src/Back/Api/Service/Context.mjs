/**
 * Model to represent context for plugins services.
 * All plugins services use this context to interchange data with HTTP-server (and, through the server, with clients).
 *
 * @namespace TeqFw_Web_Back_Api_Service_Context
 */
// MODULE'S IMPORT
import {constants as H2} from 'http2';

// MODULE'S VARS
const NS = 'TeqFw_Web_Back_Api_Service_Context';

export default class TeqFw_Web_Back_Api_Service_Context {
    /** @type {Object} */
    inData;
    /** @type {Object} */
    outData;
    /** @type {Object<string, string>} */
    outHeaders;
    /** @type {TeqFw_Web_Back_Api_Request_IContext} */
    requestContext;
    /** @type {{string, string}} */
    routeParams;

    /**
     * Get object that is shared between all handlers from request context.
     * TODO: should we return prop of the shared object for method param (getHandlersShare(name) => shared[name])?
     * @return {Object}
     */
    getHandlersShare() {
        return this.requestContext.getHandlersShare();
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
     * Get context for current request.
     * @return TeqFw_Web_Back_Api_Request_IContext
     */
    getRequestContext() {
        return this.requestContext;
    }

    /**
     * Get params for route (/post/:postId/comment/:commentId).
     * @return {{string, string}} data
     */
    getRouteParams() {
        return this.routeParams;
    }

    /**
     * Set service input data extracted from the POSTed JSON.
     * @param {Object} data
     */
    setInData(data) {
        this.inData = data;
    }

    /**
     * Set service output data to be send as JSON in the response.
     * @param {Object} data
     */
    setOutData(data) {
        this.outData = data;
    }

    /**
     * Add/replace one header to be send in the response.
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
     * Set context to current request.
     * @param {TeqFw_Web_Back_Api_Request_IContext} data
     */
    setRequestContext(data) {
        this.requestContext = data;
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
 * @memberOf TeqFw_Web_Back_Api_Service_Context
 */
export class Factory {
    /**
     * @param {TeqFw_Web_Back_Api_Service_Context|null} data
     * @return {TeqFw_Web_Back_Api_Service_Context}
     */
    create(data = null) {
        const res = new TeqFw_Web_Back_Api_Service_Context();
        res.inData = data?.inData;
        res.outData = data?.outData;
        res.outHeaders = data?.outHeaders ?? {};
        res.requestContext = data?.requestContext;
        res.routeParams = data?.routeParams ?? {};
        return res;
    }
}

// finalize code components for this es6-module
Object.freeze(TeqFw_Web_Back_Api_Service_Context);
Object.defineProperty(Factory, 'name', {value: `${NS}.${Factory.constructor.name}`});
