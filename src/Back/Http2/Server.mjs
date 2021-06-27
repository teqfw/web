/**
 * HTTP/2 server to process web requests.
 *
 * @namespace TeqFw_Web_Back_Http2_Server
 */
// MODULE'S IMPORT
import http2 from 'http2';

// MODULE'S VARS
const NS = 'TeqFw_Web_Back_Http2_Server';

// MODULE'S CLASSES
export default class TeqFw_Web_Back_Http2_Server {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {Function|TeqFw_Web_Back_Http2_Server_Stream.action} */
        const stream = spec['TeqFw_Web_Back_Http2_Server_Stream$'];
        /** @type {TeqFw_Web_Back_Handler_Registry} */
        const handlers = spec['TeqFw_Web_Back_Handler_Registry$'];

        // PARSE INPUT & DEFINE WORKING VARS
        /** @type {Http2Server} */
        const server = http2.createServer();

        // DEFINE THIS INSTANCE METHODS
        this.init = async function () {
            // DEFINE INNER FUNCTIONS

            /**
             * Unhandled server error ('server is down').
             *
             * @param err
             */
            function onErrorHndl(err) {
                console.log('Server error: ' + err);
                // debugger;
            }

            // MAIN FUNCTIONALITY
            await handlers.init(); // create all handlers (static, api, etc.)
            server.on('error', onErrorHndl);
            server.on('stream', stream);
        }

        /**
         * Run HTTP/2 server.
         *
         * @param {number} port
         */
        this.listen = function (port) {
            server.listen(port);
        };
    }
}


