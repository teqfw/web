/**
 * Request processor for HTTP/1 server.
 *
 * @namespace TeqFw_Web_Back_Http1_Request_Processor
 */
// MODULE'S IMPORT
import $fs from 'fs';
import {constants as H2} from 'http2';
import {pipeline} from 'stream';

// MODULE'S VARS
const NS = 'TeqFw_Web_Back_Http1_Request_Processor';

// MODULE'S CLASSES

// MODULE'S FUNCTIONS
/**
 * Factory to setup execution context and to create the processor.
 *
 * @param {TeqFw_Di_SpecProxy} spec
 * @constructor
 * @memberOf TeqFw_Web_Back_Http1_Request_Processor
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
     * Process one HTTP/1 request and populate response.
     * @returns {Promise<void>}
     * @memberOf TeqFw_Web_Back_Http1_Request_Processor
     */
    async function action(req, res) {
        // DEFINE INNER FUNCTIONS
        /**
         * Validate HTTP/1 request method. 'GET' & 'HEAD' methods must be always allowed.
         *
         * @param {IncomingMessage} req
         * @returns {boolean}
         */
        function hasValidMethod(req) {
            const method = req.method;
            return (method === H2.HTTP2_METHOD_HEAD) ||
                (method === H2.HTTP2_METHOD_GET) ||
                (method === H2.HTTP2_METHOD_POST);
        }

        /**
         * Log request data.
         *
         * @param {IncomingMessage} req
         */
        function logRequest(req) {
            const method = req.method;
            const path = req.url;
            logger.debug(`${method} ${path}`);
        }

        /**
         * @param {ServerResponse} res
         */
        function respond404(res) {
            res.writeHead(
                H2.HTTP_STATUS_NOT_FOUND,
                {[H2.HTTP2_HEADER_CONTENT_TYPE]: 'text/plain; charset=utf-8'}
            );
            res.end('Requested resource is not found.');
        }

        /**
         * @param {ServerResponse} res
         */
        function respond405(res) {
            res.writeHead(
                H2.HTTP_STATUS_METHOD_NOT_ALLOWED,
                {[H2.HTTP2_HEADER_CONTENT_TYPE]: 'text/plain; charset=utf-8'}
            );
            res.end('Only HEAD, GET and POST methods are allowed.');
        }

        /**
         * @param {ServerResponse} res
         * @param {Error} err
         */
        function respond500(res, err) {
            const stack = (err.stack) ?? '';
            const message = err.message ?? 'Unknown error';
            const error = {message, stack};
            const str = JSON.stringify({error});
            logger.error(str);
            if (res.writable) {
                res.writeHead(
                    H2.HTTP_STATUS_INTERNAL_SERVER_ERROR,
                    {[H2.HTTP2_HEADER_CONTENT_TYPE]: 'application/json'}
                );
                res.end(str);
            }
        }

        // MAIN FUNCTIONALITY
        logRequest(req);

        // Analyze input and define type of the request (api or static)
        if (hasValidMethod(req)) {
            try {
                const context = fContext.create();
                context.setRequestContext({req, res});
                const all = handlers.items();
                for (const handler of all) {
                    await handler(context);
                }
                // if any handler did not completely processed the request by itself
                if (!context.isRequestComplete()) {
                    if (!context.isRequestProcessed()) {
                        // no one handler process the request
                        respond404(res);
                    } else {
                        // there is data to return in response
                        const headers = context.getResponseHeaders();
                        const file = context.getResponseFilePath();
                        if (file) {
                            res.writeHead(H2.HTTP_STATUS_OK, headers);
                            const rs = $fs.createReadStream(file);
                            pipeline(rs, res, (err, val) => {
                                if (err) logger.error(err);
                            });
                        } else {
                            res.writeHead(H2.HTTP_STATUS_OK, headers);
                            res.end(context.getResponseBody());
                        }
                    }
                }
            } catch (e) {
                respond500(res, e);
            }
        } else {
            // Request method is not allowed.
            respond405(res);
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
