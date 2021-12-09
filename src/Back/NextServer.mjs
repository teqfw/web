/**
 * HTTP server to process web requests.
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
        /** @type {TeqFw_Web_Back_Scan_Handler.act|function} */
        const scan = spec['TeqFw_Web_Back_Scan_Handler$'];
        /** @type {TeqFw_Web_Back_Scan_Handler_Registry} */
        const registry = spec['TeqFw_Web_Back_Scan_Handler_Registry$'];

        // DEFINE WORKING VARS


        // DEFINE THIS INSTANCE METHODS
        this.run = async function ({port, useHttp1, key, cert}) {
            // DEFINE INNER FUNCTIONS

            // MAIN FUNCTIONALITY

            // get all web requests handlers and create listeners
            await scan({});
            /** @type {Object<string, function[]>} */
            const listeners = registry.getListenersByEvent();

            // create server
            const server = createHttp1Server({});
            // add listeners to the server
            for (const event of Object.keys(listeners))
                for (const one of listeners[event]) {
                    server.on(event, one);
                    logger.info(`Listener '${one.name}' is bound to event '${event}'.`);
                }

            // start server
            server.listen(port);
            logger.info(`Web server is started on port ${port}.`);
        }

    }
}


