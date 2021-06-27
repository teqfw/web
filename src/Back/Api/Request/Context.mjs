/**
 * Request context model shared between HTTP/1 & HTTP/2 servers.
 *
 * @namespace TeqFw_Web_Back_Api_Request_Context
 */
// MODULE'S IMPORT
import {constants as H2} from 'http2';
// MODULE'S VARS
const NS = 'TeqFw_Web_Back_Api_Request_Context';

// MODULE'S CLASSES
class TeqFw_Web_Back_Api_Request_Context {
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
    /** @type {string} */
    outBody;
    /** @type {string} */
    outFilePath;
    /** @type {Object<string, string>} */
    outHeaders = {};
    /**
     * HTTP request is completely processed by handler (all data is sent to client).
     * @type {boolean}
     */
    requestComplete = false;
    /**
     * HTTP request is processed (response data is created) but response is not sent to client.
     * @type {boolean}
     */
    requestProcessed = false;

    // DEFINE PROTO METHODS
    /**
     * @returns {Object<string, string>}
     */
    getInHeaders() {
        if (this.http1Request) {
            return this.http1Request.headers;
        }
    }

    /**
     * @returns {string}
     */
    getOutBody() {
        return this.outBody;
    }

    /**
     * @returns {string}
     */
    getOutFilePath() {
        return this.outFilePath;
    }

    /**
     * @returns {Object<string, string>}
     */
    getOutHeaders() {
        return this.outHeaders;
    }

    /**
     * @returns {string}
     */
    getPath() {
        if (this.http1Request) {
            return this.http1Request.url;
        } else if (this.http2Headers[H2.HTTP2_HEADER_PATH]) {
            return this.http2Headers[H2.HTTP2_HEADER_PATH];
        }
    }

    isRequestComplete() {
        return this.requestComplete;
    }

    isRequestProcessed() {
        return this.requestProcessed;
    }

    /**
     * Init context with HTTP/1 data.
     * @param {IncomingMessage} req
     * @param {ServerResponse} res
     */
    setHttp1Context(req, res) {
        this.http1Request = req;
        this.http1Response = res;
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

    /**
     * Set path to file to return in response.
     * @param {string} path
     */
    setOutFilePath(path) {
        this.outFilePath = path;
    }

    /**
     * Add/replace response headers.
     * @param {string} key
     * @param {string} value
     */
    setOutHeader(key, value) {
        this.outHeaders[key] = value;
    }

    setRequestComplete() {
        this.requestComplete = true;
    }

    setRequestProcessed() {
        this.requestProcessed = true;
    }
}

/**
 * Factory to create new instances.
 * @memberOf TeqFw_Web_Back_Api_Request_Context
 */
class Factory {
    constructor() {
        /**
         * @param {TeqFw_Web_Back_Api_Request_Context|null} data
         * @return {TeqFw_Web_Back_Api_Request_Context}
         */
        this.create = function (data = null) {
            return new TeqFw_Web_Back_Api_Request_Context();
        }
    }
}

// freeze class to deny attributes changes then export class
Object.freeze(TeqFw_Web_Back_Api_Request_Context);
Object.defineProperty(Factory, 'name', {value: `${NS}.${Factory.constructor.name}`});
export {
    TeqFw_Web_Back_Api_Request_Context as default,
    Factory
};
