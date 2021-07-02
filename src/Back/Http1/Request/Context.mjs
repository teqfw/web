/**
 * Request context model shared between HTTP/1 & HTTP/2 servers.
 *
 * @namespace TeqFw_Web_Back_Http1_Request_Context
 */
// MODULE'S IMPORT
import {constants as H2} from 'http2';
// MODULE'S VARS
const NS = 'TeqFw_Web_Back_Http1_Request_Context';

// MODULE'S CLASSES
/**
 * @implements TeqFw_Web_Back_Api_Request_IContext
 */
class TeqFw_Web_Back_Http1_Request_Context {
    /** @type {Object} */
    handlersShare;
    /** @type {IncomingMessage} */
    http1Request;
    /** @type {ServerResponse} */
    http1Response;
    /** @type {string} */
    http2Body;
    /** @type {number} */
    http2Flags;
    /** @type {Object<string, string>} */
    http2Headers;
    /** @type {ServerHttp2Stream} */
    http2Stream;
    /** @type {Buffer[]} */
    inputData;
    /**
     * HTTP request is completely processed by handler (all data is sent to client).
     * @type {boolean}
     */
    requestComplete;
    /**
     * HTTP request is processed (response data is created) but response is not sent to client.
     * @type {boolean}
     */
    requestProcessed;
    /** @type {string} */
    responseBody;
    /** @type {string} */
    responseFilePath;
    /** @type {Object<string, string>} */
    responseHeaders;

    // DEFINE PROTO METHODS
    /**
     * Get object that is shared between all handlers.
     * @return {Object}
     */
    getHandlersShare() {
        return this.handlersShare;
    }

    getInputData() {
        return this.inputData;
    }

    getPath() {
        if (this.http1Request) {
            return this.http1Request.url;
        } else if (this.http2Headers[H2.HTTP2_HEADER_PATH]) {
            return this.http2Headers[H2.HTTP2_HEADER_PATH];
        }
    }

    /**
     * @returns {Object<string, string>}
     */
    getRequestHeaders() {
        if (this.http1Request) {
            return this.http1Request.headers;
        }
    }

    /**
     * @returns {string}
     */
    getResponseBody() {
        return this.responseBody;
    }

    /**
     * @returns {string}
     */
    getResponseFilePath() {
        return this.responseFilePath;
    }

    /**
     * @returns {Object<string, string>}
     */
    getResponseHeaders() {
        return this.responseHeaders;
    }

    isRequestComplete() {
        return this.requestComplete;
    }

    isRequestProcessed() {
        return this.requestProcessed;
    }

    /**
     * Init context with HTTP/2 data.
     * @param {ServerHttp2Stream} stream
     * @param {Object<string, string>} headers
     * @param {number} flags
     * @param {string} body
     */
    setHttp2Context(stream, headers, flags, body) {
        this.http2Stream = stream;
        this.http2Headers = headers;
        this.http2Flags = flags;
        this.http2Body = body;
    }

    setInputData(chunks) {
        this.inputData = chunks;
    }

    markRequestComplete() {
        this.requestComplete = true;
    }

    markRequestProcessed() {
        this.requestProcessed = true;
    }

    /**
     * Init request context with HTTP/1 data.
     *
     * @param {IncomingMessage} req
     * @param {ServerResponse} res
     */
    setRequestContext({req, res}) {
        this.http1Request = req;
        this.http1Response = res;
    }

    setResponseBody(data) {
        this.responseBody = data;
    }

    setResponseFilePath(path) {
        this.responseFilePath = path;
    }

    setResponseHeader(key, value) {
        if (key === H2.HTTP2_HEADER_SET_COOKIE) {
            if (this.responseHeaders[key]) {
                // merge cookies
                this.responseHeaders[key] += `;${value}`;
            } else {
                // add cookie
                this.responseHeaders[key] = value;
            }
        } else {
            this.responseHeaders[key] = value;
        }
    }
}

/**
 * Factory to create new instances.
 * @memberOf TeqFw_Web_Back_Http1_Request_Context
 */
class Factory {
    constructor() {
        /**
         * @param {TeqFw_Web_Back_Http1_Request_Context|null} data
         * @return {TeqFw_Web_Back_Http1_Request_Context}
         */
        this.create = function (data = null) {
            const res = new TeqFw_Web_Back_Http1_Request_Context();
            res.handlersShare = (typeof data?.handlersShare === 'object') ? data.handlersShare : {};
            res.http1Request = data?.http1Request;
            res.http1Response = data?.http1Response;
            res.http2Body = data?.http2Body;
            res.http2Flags = data?.http2Flags;
            res.http2Headers = (typeof data?.http2Headers === 'object') ? data.http2Headers : {};
            res.http2Stream = data?.http2Stream;
            res.requestComplete = data?.requestComplete ?? false;
            res.requestProcessed = data?.requestProcessed ?? false;
            res.responseBody = data?.responseBody;
            res.responseFilePath = data?.responseFilePath;
            res.responseHeaders = (typeof data?.responseHeaders === 'object') ? data.responseHeaders : {};
            return res;
        }
    }
}

// freeze class to deny attributes changes then export class
Object.freeze(TeqFw_Web_Back_Http1_Request_Context);
Object.defineProperty(Factory, 'name', {value: `${NS}.${Factory.constructor.name}`});
export {
    TeqFw_Web_Back_Http1_Request_Context as default,
    Factory
};
