/**
 * Handlers dispatcher scan for HTTP request handlers and creates 'onRequest' listener.
 *
 * @namespace TeqFw_Web_Back_Server_Dispatcher
 */
// MODULE'S IMPORT
import {constants as H2} from 'http2';
import sb from 'stream-buffers';

// MODULE'S VARS
const NS = 'TeqFw_Web_Back_Server_Dispatcher';
const {
    HTTP2_HEADER_CONTENT_LENGTH,
    HTTP2_HEADER_CONTENT_TYPE,
    HTTP2_METHOD_GET,
    HTTP2_METHOD_HEAD,
    HTTP2_METHOD_POST,
} = H2;

export default class TeqFw_Web_Back_Server_Dispatcher {

    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Web_Back_Defaults} */
        const DEF = spec['TeqFw_Web_Back_Defaults$'];
        /** @type {TeqFw_Web_Back_Scan_Handler.act|function} */
        const scan = spec['TeqFw_Web_Back_Scan_Handler$'];
        /** @type {TeqFw_Web_Back_Model_Address} */
        const mAddress = spec['TeqFw_Web_Back_Model_Address$'];
        /** @type {TeqFw_Web_Back_Server_Respond.respond405|function} */
        const respond405 = spec['TeqFw_Web_Back_Server_Respond.respond405'];

        // DEFINE WORKING VARS / PROPS
        /** @type {TeqFw_Web_Back_Api_Request_INewHandler[]} */
        const handlers = [];

        // DEFINE INNER FUNCTIONS
        /**
         * Listener for 'request' event on the web server.
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest}req
         * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} res
         */
        async function onRequest(req, res) {
            // DEFINE INNER FUNCTIONS

            function isMethodAllowed(method) {
                return (method === HTTP2_METHOD_HEAD)
                    || (method === HTTP2_METHOD_GET)
                    || (method === HTTP2_METHOD_POST);
            }

            /**
             * Read body and save it to `req` structure if MIME type is 'text/plain' or 'application/json'.
             * @param {string} method
             * @param {string[]} headers
             * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest}req
             * @return {Promise<void>}
             */
            async function parseBody(method, headers, req) {
                // DEFINE INNER FUNCTIONS
                /**
                 * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest}req
                 * @return {Promise<string>}
                 */
                async function readBody(req) {
                    const contentLength = req.headers[HTTP2_HEADER_CONTENT_LENGTH] ?? '';
                    const initialSize = Number.parseInt(contentLength) || sb.DEFAULT_INITIAL_SIZE;
                    const buf = new sb.WritableStreamBuffer({initialSize});

                    return new Promise((resolve, reject) => {
                        req.pipe(buf);
                        req.on('error', reject);
                        req.on('end', () => resolve(buf.getContentsAsString()));
                    });
                }


                // MAIN FUNCTIONALITY
                // should we process body of the input message?
                if (method === HTTP2_METHOD_POST) {
                    const contentType = headers[HTTP2_HEADER_CONTENT_TYPE] ?? '';
                    if (contentType.startsWith('application/json')) {
                        const body = await readBody(req);
                        req[DEF.REQ_BODY_JSON] = JSON.parse(body);
                    } else if (contentType.startsWith('text/plain')) {
                        req[DEF.REQ_BODY] = await readBody(req);
                    }
                }
            }


            // MAIN FUNCTIONALITY
            // prepare data to collect processors that will handle current request
            const {headers, method, url} = req;
            // check HTTP method
            if (isMethodAllowed(method)) {
                await parseBody(method, headers, req);
                const address = mAddress.parsePath(url);
                // collect processors
                const active = [];
                for (const one of handlers)
                    if (one.requestIsMine({method, address, headers}))
                        active.push(one.getProcessor());
                // run processors one by one
                for (const one of active)
                    await one(req, res);

            } else respond405(res);
        }

        // DEFINE INSTANCE METHODS
        /**
         * Scan plugins, create handlers for 'request' event, order handlers by 'before-after'.
         * @return {Promise<(function((IncomingMessage|Http2ServerRequest), (ServerResponse|Http2ServerResponse)): Promise<void>)|*>}
         */
        this.createHandlers = async function () {
            const ordered = await scan({});
            Array.prototype.push.apply(handlers, ordered);
        }
        /**
         * Get dispatcher listener for 'request' event.
         * @return {(function((IncomingMessage|Http2ServerRequest), (ServerResponse|Http2ServerResponse)): Promise<void>)|*}
         */
        this.getListener = () => onRequest;

        // MAIN FUNCTIONALITY
        Object.defineProperty(onRequest, 'name', {value: `${NS}.${onRequest.name}`});
    }

}
