/**
 * HTTP server to process web requests.
 * Can start in HTTP/1 & HTTP/2 modes.
 *
 * @namespace TeqFw_Web_Back_NextServer
 */
// MODULE'S IMPORT
import {createServer as createHttp1Server} from 'http';
import {createSecureServer, createServer} from 'http2';

// MODULE'S FUNCTIONS


// MODULE'S CLASSES
export default class TeqFw_Web_Back_NextServer {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Http2_Back_Defaults} */
        const DEF = spec['TeqFw_Http2_Back_Defaults$'];
        /** @type {TeqFw_Core_Shared_Logger} */
        const logger = spec['TeqFw_Core_Shared_Logger$'];
        /** @type {TeqFw_Core_Back_Config} */
        const config = spec['TeqFw_Core_Back_Config$'];
        /** @type {TeqFw_Web_Back_Server_Dispatcher} */
        const dispatcher = spec['TeqFw_Web_Back_Server_Dispatcher$'];

        // DEFINE WORKING VARS


        // DEFINE THIS INSTANCE METHODS
        this.run = async function ({port, useHttp1, key, cert}) {
            // DEFINE INNER FUNCTIONS

            // MAIN FUNCTIONALITY

            // create server
            // TODO: use HTTP/1 server temporary
            const server = createHttp1Server({});

            // create request handlers, bind dispatcher to request event
            await dispatcher.createHandlers();
            const onRequest = dispatcher.getListener();
            server.on('request', onRequest);
            // start server
            server.listen(port);
            logger.info(`Web server is started on port ${port}.`);
        }

    }
}


