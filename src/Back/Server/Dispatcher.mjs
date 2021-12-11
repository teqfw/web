/**
 * Handlers dispatcher to process one request.
 *
 * @namespace TeqFw_Web_Back_Server_Dispatcher
 */
// MODULE'S IMPORT
import {constants as H2} from 'http2';


// MODULE'S VARS
const NS = 'TeqFw_Web_Back_Server_Dispatcher';
const {
    HTTP2_HEADER_CONTENT_TYPE,
    HTTP_STATUS_BAD_REQUEST,
    HTTP_STATUS_NOT_FOUND,
} = H2;

export default class TeqFw_Web_Back_Server_Dispatcher {

    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Web_Back_Defaults} */
        const DEF = spec['TeqFw_Web_Back_Defaults$'];
        /** @type {TeqFw_Web_Back_Scan_Handler.act|function} */
        const scan = spec['TeqFw_Web_Back_Scan_Handler$'];
        /** @type {TeqFw_Web_Back_Scan_Handler_Registry} */
        const registry = spec['TeqFw_Web_Back_Scan_Handler_Registry$'];
        /** @type {TeqFw_Web_Back_Model_Address} */
        const mAddress = spec['TeqFw_Web_Back_Model_Address$'];

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
            // prepare data to collect processors that will handle current request
            const {headers, method, url} = req;
            const address = mAddress.parsePath(url);
            // collect processors
            const active = [];
            for (const one of handlers)
                if (one.requestIsMine({method, address, headers}))
                    active.push(one.getProcessor());
            // run processors one by one
            for (const one of active)
                await one(req, res);
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
