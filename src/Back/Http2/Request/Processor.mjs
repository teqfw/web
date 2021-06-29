/**
 * Request processor for HTTP/2 server.
 *
 * @namespace TeqFw_Web_Back_Http2_Request_Processor
 */
// MODULE'S IMPORT
import {constants as H2} from 'http2';

// MODULE'S VARS
const NS = 'TeqFw_Web_Back_Http2_Request_Processor';

// MODULE'S CLASSES

// MODULE'S FUNCTIONS
/**
 * Factory to setup execution context and to create the processor.
 *
 * @param {TeqFw_Di_SpecProxy} spec
 * @constructor
 * @memberOf TeqFw_Web_Back_Http2_Request_Processor
 */
function Factory(spec) {
    // EXTRACT DEPS
    /** @type {TeqFw_Core_Logger} */
    const logger = spec['TeqFw_Core_Logger$'];
    /** @type {TeqFw_Web_Back_Handler_Registry} */
    const handlers = spec['TeqFw_Web_Back_Handler_Registry$'];
    /** @type {TeqFw_Web_Back_Http1_Request_Context.Factory} */
    const fContext = spec['TeqFw_Web_Back_Http1_Request_Context#Factory$'];

    // PARSE INPUT & DEFINE WORKING VARS

    // DEFINE INNER FUNCTIONS
    /**
     * Process one HTTP/2 request and populate response.
     *
     * @param {ServerHttp2Stream} stream
     * @param {Object<string, string>} headers
     * @param {number} flags
     * @param {string} body
     * @returns {Promise<void>}
     * @memberOf TeqFw_Web_Back_Http2_Request_Processor
     */
    async function action(stream, headers, flags, body) {
        // DEFINE INNER FUNCTIONS
        /**
         * Validate HTTP request method. 'GET' & 'HEAD' methods must be always allowed.
         *
         * @param {Object<String, String>} headers
         * @returns {boolean}
         */
        function hasValidMethod(headers) {
            const method = headers[H2.HTTP2_HEADER_METHOD];
            return (method === H2.HTTP2_METHOD_HEAD) ||
                (method === H2.HTTP2_METHOD_GET) ||
                (method === H2.HTTP2_METHOD_POST);
        }

        /**
         * Log request data.
         *
         * @param {Object<String, String>} headers
         */
        function logRequest(headers) {
            const method = headers[H2.HTTP2_HEADER_METHOD];
            const path = headers[H2.HTTP2_HEADER_PATH];
            logger.debug(`${method} ${path}`);
        }

        /**
         * @param {ServerHttp2Stream} stream
         */
        function respond404(stream) {
            stream.respond({
                [H2.HTTP2_HEADER_STATUS]: H2.HTTP_STATUS_NOT_FOUND,
                [H2.HTTP2_HEADER_CONTENT_TYPE]: 'text/plain; charset=utf-8'
            });
            const content = 'Appropriate handler is not found for this request.';
            stream.end(content);
        }

        /**
         * @param {ServerHttp2Stream} stream
         */
        function respond405(stream) {
            stream.respond({
                [H2.HTTP2_HEADER_STATUS]: H2.HTTP_STATUS_METHOD_NOT_ALLOWED,
                [H2.HTTP2_HEADER_CONTENT_TYPE]: 'text/plain; charset=utf-8'
            });
            stream.end('Only HEAD, GET and POST methods are allowed.');
        }

        /**
         * Close stream on any error.
         *
         * @param {ServerHttp2Stream} stream
         * @param {Error} err
         */
        function respond500(stream, err) {
            const stack = (err.stack) ?? '';
            const message = err.message ?? 'Unknown error';
            const error = {message, stack};
            const str = JSON.stringify({error});
            console.error(str);
            if (stream.writable) {
                stream.respond({
                    [H2.HTTP2_HEADER_STATUS]: H2.HTTP_STATUS_INTERNAL_SERVER_ERROR,
                    [H2.HTTP2_HEADER_CONTENT_TYPE]: 'application/json'
                });
                stream.end(str);
            }
        }

        // MAIN FUNCTIONALITY
        logRequest(headers);

        if (hasValidMethod(headers)) {
            try {
                // create request context
                const context = fContext.create();
                context.setHttp2Context(stream, headers, flags, body);
                // run all handlers to process request
                const all = handlers.items();
                for (const handler of all) {
                    await handler(context);
                }
                // if any handler did not completely processed the request by itself
                if (!context.isRequestComplete()) {
                    if (!context.isRequestProcessed()) {
                        // no one handler process the request
                        respond404(stream);
                    } else {
                        // there is data to return in response
                        const headers = context.getResponseHeaders();
                        headers[H2.HTTP2_HEADER_STATUS] = H2.HTTP_STATUS_OK;
                        const file = context.getResponseFilePath();
                        if (file) {
                            stream.respondWithFile(file, headers);
                        } else {
                            stream.respond(headers);
                            stream.end(context.getResponseBody());
                        }
                    }
                }
            } catch (e) {
                respond500(stream, e);
            }
        } else {
            // Request method is not allowed.
            respond405(stream);
        }

    }

    // MAIN FUNCTIONALITY

    // COMPOSE RESULT
    Object.defineProperty(action, 'name', {value: `${NS}.${action.name}`});
    return action;
}

// MODULE'S EXPORT
Object.defineProperty(Factory, 'name', {value: `${NS}.${Factory.name}`});
export {
    Factory as default,
};
