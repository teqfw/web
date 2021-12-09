/**
 * Web server handler to final processing of the requests (HTTP status 404) and to process 'error' events.
 */
// MODULE'S IMPORT
import {constants as H2} from 'http2';

// MODULE'S VARS
const NS = 'TeqFw_Web_Back_Handler_Final';
const {
    HTTP2_HEADER_CONTENT_TYPE,
    HTTP_STATUS_NOT_FOUND,
} = H2;

/**
 * @implements TeqFw_Web_Back_Api_IHandler
 */
export default class TeqFw_Web_Back_Handler_Final {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Web_Back_Defaults} */
        const DEF = spec['TeqFw_Web_Back_Defaults$'];

        // DEFINE WORKING VARS / PROPS
        /** @type {Object<string, function>} */
        const _listeners = {};

        // DEFINE INNER FUNCTIONS
        /**
         * TODO: use it ore remove it
         * @param err
         */
        function onError(err) {
            debugger
            const msg = 'We have not response object here...';
            console.log(msg);
            throw new Error(msg);
        }

        /**
         * Send 'Error 404' if response is not handled yet.
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest}req
         * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} res
         */
        function onRequest(req, res) {
            if (!res.headersSent) {
                res.writeHead(HTTP_STATUS_NOT_FOUND, {
                    [HTTP2_HEADER_CONTENT_TYPE]: 'text/plain',
                });
                res.end('Requested resource is not found.');
            }
        }

        // DEFINE INSTANCE METHODS
        this.createListeners = async function () {
            _listeners['error'] = onError;
            _listeners['request'] = onRequest;
        }

        this.getListener = (event) => _listeners[event];

        // MAIN FUNCTIONALITY
        Object.defineProperty(onError, 'name', {value: `${NS}.${onError.name}`});
        Object.defineProperty(onRequest, 'name', {value: `${NS}.${onRequest.name}`});
    }
}
