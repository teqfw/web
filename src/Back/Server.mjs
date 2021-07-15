/**
 * HTTP/1 server to process web requests.
 *
 * @namespace TeqFw_Web_Back_Server
 */
// MODULE'S IMPORT
import http from 'http';

// MODULE'S CLASSES
export default class TeqFw_Web_Back_Server {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {Function|TeqFw_Web_Back_Server_Request_Processor.action} */
        const process = spec['TeqFw_Web_Back_Server_Request_Processor$'];
        /** @type {TeqFw_Web_Back_Handler_Registry} */
        const registry = spec['TeqFw_Web_Back_Handler_Registry$'];

        // PARSE INPUT & DEFINE WORKING VARS
        /** @type {http.Server} */
        const server = http.createServer();

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
            await registry.init(); // create all handlers (static, api, etc.)
            server.on('error', onErrorHndl);
            server.on('request', process);
        }

        /**
         * Run HTTP/1 server.
         *
         * @param {number} port
         */
        this.listen = function (port) {
            server.listen(port);
        };
    }
}


