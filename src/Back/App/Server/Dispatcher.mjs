/**
 * Handlers dispatcher scan for HTTP request handlers and creates 'onRequest' listener.
 *
 * @namespace TeqFw_Web_Back_App_Server_Dispatcher
 */
// MODULE'S IMPORT
import {constants as H2} from 'node:http2';
import sb from 'stream-buffers'; // to read body as string

// MODULE'S VARS
const NS = 'TeqFw_Web_Back_App_Server_Dispatcher';
const {
    HTTP2_HEADER_CONTENT_LENGTH,
    HTTP2_HEADER_CONTENT_TYPE,
    HTTP2_METHOD_GET,
    HTTP2_METHOD_HEAD,
    HTTP2_METHOD_POST,
} = H2;

export default class TeqFw_Web_Back_App_Server_Dispatcher {
    /**
     * @param {TeqFw_Web_Back_Defaults} DEF
     * @param {TeqFw_Core_Shared_Api_Logger} logger -  instance
     * @param {TeqFw_Web_Back_App_Server_Scan_Handler.act|function} scan
     * @param {TeqFw_Web_Back_Mod_Address} mAddress
     * @param {TeqFw_Web_Back_App_Server_Respond.respond405|function} respond405
     */

    constructor(
        {
            TeqFw_Web_Back_Defaults$: DEF,
            TeqFw_Core_Shared_Api_Logger$$: logger,
            TeqFw_Web_Back_App_Server_Scan_Handler$: scan,
            TeqFw_Web_Back_Mod_Address$: mAddress,
            'TeqFw_Web_Back_App_Server_Respond.respond405': respond405,
        }) {
        // VARS
        /** @type {TeqFw_Web_Back_Api_Dispatcher_IHandler[]} */
        const handlers = [];

        // FUNCS
        /**
         * Listener for 'request' event on the web server.
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest}req
         * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} res
         */
        async function onRequest(req, res) {
            // FUNCS

            function isMethodAllowed(method) {
                return (method === HTTP2_METHOD_HEAD)
                    || (method === HTTP2_METHOD_GET)
                    || (method === HTTP2_METHOD_POST);
            }

            /**
             * Read body and save it to `req` structure if MIME type is 'text/plain' or 'application/json'.
             * @param {string} method
             * @param {string[]|IncomingHttpHeaders} headers
             * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest}req
             * @return {Promise<void>}
             */
            async function parseBody(method, headers, req) {
                // FUNCS
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

                // MAIN
                // should we process body of the input message?
                if (method === HTTP2_METHOD_POST) {
                    const contentType = headers[HTTP2_HEADER_CONTENT_TYPE] ?? '';
                    /** @type {Object} */
                    const shares = req[DEF.HNDL_SHARE];
                    // TODO: add handler's code here (request body preprocessors???)
                    if (contentType.startsWith('application/json')) {
                        const body = await readBody(req);
                        shares[DEF.SHARE_REQ_BODY_JSON] = JSON.parse(body);
                    } else if (contentType.startsWith('text/plain')) {
                        shares[DEF.SHARE_REQ_BODY] = await readBody(req);
                    }
                }
            }

            // MAIN
            // prepare data to collect processors that will handle current request
            const {headers, method, url} = req;
            // check HTTP method
            if (isMethodAllowed(method)) {
                // set 'key-value' registry for shared objects to request & response (the same object)
                req[DEF.HNDL_SHARE] = res[DEF.HNDL_SHARE] = {};
                // try to parse body for text & json input
                await parseBody(method, headers, req);
                const address = mAddress.parsePath(url);
                // collect processors
                const active = [];
                for (const one of handlers)
                    if (one.canProcess({method, address, headers}))
                        active.push(one.getProcessor());
                // run processors one by one
                for (const one of active) {
                    try {
                        await one(req, res);
                    } catch (e) {
                        logger.error(`Error in processor '${one?.namespace}': ` + e);
                    }
                }
            } else respond405(res);
        }

        // INSTANCE METHODS
        /**
         * Scan plugins, create handlers for 'request' event, order handlers by 'before-after'.
         * @return {Promise<(function((IncomingMessage|Http2ServerRequest), (ServerResponse|Http2ServerResponse)): Promise<void>)|*>}
         */
        this.createHandlers = async function () {
            const ordered = await scan({});
            handlers.push(...ordered);
        }

        /**
         * Get dispatcher listener for 'request' event.
         * @return {(function((IncomingMessage|Http2ServerRequest), (ServerResponse|Http2ServerResponse)): Promise<void>)|*}
         */
        this.getListener = () => onRequest;

        // MAIN
        Object.defineProperty(onRequest, 'namespace', {value: NS});
    }

}
