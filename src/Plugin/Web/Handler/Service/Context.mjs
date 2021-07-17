/**
 * Model to represent context for plugins services.
 *
 * @namespace TeqFw_Web_Plugin_Web_Handler_Service_Context
 */
// MODULE'S IMPORT
import {constants as H2} from 'http2';

// MODULE'S VARS
const NS = 'TeqFw_Web_Plugin_Web_Handler_Service_Context';

/**
 * @implements TeqFw_Web_Back_Api_Service_IContext
 */
class TeqFw_Web_Plugin_Web_Handler_Service_Context {
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

    getHandlersShare() {
        return this.requestContext.getHandlersShare();
    }

    getInData() {
        return this.inData;
    }

    getOutData() {
        return this.outData;
    }

    getOutHeaders() {
        return this.outHeaders;
    }

    getRequestContext() {
        return this.requestContext;
    }

    getRouteParams() {
        return this.routeParams;
    }

    setInData(data) {
        this.inData = data;
    }

    setOutData(data) {
        this.outData = data;
    }

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

    setRequestContext(data) {
        this.requestContext = data;
    }

    setRouteParams(data) {
        this.routeParams = data;
    }
}

/**
 * Factory to create new instances.
 * @memberOf TeqFw_Web_Plugin_Web_Handler_Service_Context
 */
class Factory {
    /**
     * @param {TeqFw_Web_Plugin_Web_Handler_Service_Context|null} data
     * @return {TeqFw_Web_Plugin_Web_Handler_Service_Context}
     */
    create(data = null) {
        const res = new TeqFw_Web_Plugin_Web_Handler_Service_Context();
        res.inData = data?.inData;
        res.outData = data?.outData;
        res.outHeaders = data?.outHeaders ?? {};
        res.requestContext = data?.requestContext;
        res.routeParams = data?.routeParams ?? {};
        return res;
    }
}

// freeze class to deny attributes changes then export class
Object.freeze(TeqFw_Web_Plugin_Web_Handler_Service_Context);
Object.defineProperty(Factory, 'name', {value: `${NS}.${Factory.constructor.name}`});
export {
    TeqFw_Web_Plugin_Web_Handler_Service_Context as default,
    Factory,
}
