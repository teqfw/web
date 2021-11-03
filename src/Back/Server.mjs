/**
 * HTTP/1 server to process web requests.
 *
 * @namespace TeqFw_Web_Back_Server
 */
// MODULE'S IMPORT
import http from 'http';

// MODULE'S FUNCTIONS
/**
 * Add handlers for server events.
 * TODO: remove it before deploy
 * @param {http.Server} server
 */
function traceEvents(server) {
    // DEFINE INNER FUNCTIONS

    // MAIN FUNCTIONALITY

    // handlers to include in the code
    // server.on('connection', evtConnection);
    // handlers to trace server side events
    server.on('checkContinue', () => console.log('checkContinue'));
    server.on('checkExpectation', () => console.log('checkExpectation'));
    server.on('clientError', () => console.log('clientError'));
    server.on('close', () => console.log('close'));
    server.on('connect', () => console.log('connect'));
    // server.on('connection', () => console.log('connection'));
    server.on('removeListener', () => console.log('removeListener'));
    // useless events
    // server.on('listening', () => console.log('listening'));
    // server.on('newListener', () => console.log('newListener'));
}

// MODULE'S CLASSES
export default class TeqFw_Web_Back_Server {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Web_Back_Handler_Registry} */
        const registry = spec['TeqFw_Web_Back_Handler_Registry$'];
        /**
         * Handler for HTTP/1 'connection' events.
         * @type {TeqFw_Web_Back_Server_Event_Connection.handle|function}
         */
        const evtConnection = spec['TeqFw_Web_Back_Server_Event_Connection$'];
        /**
         * Handler for HTTP/1 'error' events.
         * @type {TeqFw_Web_Back_Server_Event_Error.handle|function}
         */
        const evtError = spec['TeqFw_Web_Back_Server_Event_Error$'];
        /**
         * Handler for HTTP/1 'request' events.
         * @type {Function|TeqFw_Web_Back_Server_Event_Request.action}
         */
        const evtRequest = spec['TeqFw_Web_Back_Server_Event_Request$'];

        // PARSE INPUT & DEFINE WORKING VARS
        /** @type {http.Server} */
        const server = http.createServer();

        // DEFINE THIS INSTANCE METHODS
        this.init = async function () {
            // create all processors (static, api, etc.)
            await registry.init();
            // add event handlers to the server
            server.on('error', evtError);
            server.on('connection', evtConnection);
            server.on('request', evtRequest);
            //traceEvents(server);
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


