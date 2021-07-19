/**
 * Request processor for HTTP/1 server.
 *
 * @namespace TeqFw_Web_Back_Server_Request_Processor
 */
// MODULE'S IMPORT
import $fs from 'fs';
import {constants as H2} from 'http2';
import {pipeline} from 'stream';

// MODULE'S VARS
const NS = 'TeqFw_Web_Back_Server_Request_Processor';

// MODULE'S FUNCTIONS
/**
 * Factory to setup execution context and to create the processor.
 *
 * @param {TeqFw_Di_Shared_SpecProxy} spec
 * @memberOf TeqFw_Web_Back_Server_Request_Processor
 */
function Factory(spec) {
    // EXTRACT DEPS
    /** @type {TeqFw_Web_Back_Defaults} */
    const DEF = spec['TeqFw_Web_Back_Defaults$'];
    /** @type {TeqFw_Core_Shared_Logger} */
    const logger = spec['TeqFw_Core_Shared_Logger$'];
    /** @type {TeqFw_Web_Back_Handler_Registry} */
    const handlers = spec['TeqFw_Web_Back_Handler_Registry$'];
    /** @type {TeqFw_Web_Back_Api_Request_IContext.Factory} */
    const fContext = spec['TeqFw_Web_Back_Server_Request_Context#Factory$']; // use impl. for interface

    // DEFINE INNER FUNCTIONS
    /**
     * Process one HTTP/1 request and populate response.
     * @returns {Promise<void>}
     * @memberOf TeqFw_Web_Back_Server_Request_Processor
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
                (method === H2.HTTP2_METHOD_POST) ||
                (method === H2.HTTP2_METHOD_PUT) ||
                (method === H2.HTTP2_METHOD_PATCH) ||
                (method === H2.HTTP2_METHOD_DELETE);
        }

        /**
         * Log request data.
         *
         * @param {IncomingMessage} req
         */
        function logRequest(req) {
            const method = req.method;
            const path = req.url;
            logger.info(`${method} ${path}`);
        }

        /**
         *
         * @param {TeqFw_Web_Back_Api_Request_IContext} context
         * @param {Buffer[]} chunks
         * @return {Promise<void>}
         */
        async function onInputEnd(context, chunks) {
            try {
                // save input to context
                context.setInputData(chunks);
                // process all handlers in a loop
                /** @type {Array<Function|TeqFw_Web_Back_Api_Request_IHandler.handle>} */
                const all = handlers.items();
                for (const handler of all) {
                    await handler(context);
                }
                // if some handler did not completely processed the request by itself
                if (!context.isRequestComplete()) {
                    if (!context.isRequestProcessed()) {
                        // no one handler process the request
                        respond404(res);
                    } else {
                        // there is data to return in response
                        const headers = context.getResponseHeaders();
                        const file = context.getResponseFilePath();
                        const status = headers[DEF.HTTP_HEADER_STATUS] ?? H2.HTTP_STATUS_OK;
                        if (file) {
                            res.writeHead(status, headers);
                            const rs = $fs.createReadStream(file);
                            pipeline(rs, res, (err) => {
                                if (err) logger.error(err);
                            });
                        } else {
                            res.writeHead(status, headers);
                            res.end(context.getResponseBody());
                        }
                    }
                }
            } catch (e) {
                respond500(res, e);
            }
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
                /** @type {TeqFw_Web_Back_Api_Request_IContext} */
                const context = fContext.create();
                context.setRequestContext({req, res});
                // buffer to collect input data for POSTs
                /** @type {Buffer[]} */
                const chunks = [];
                // set event handlers to input stream
                req.on('data', (chunk) => chunks.push(chunk));
                req.on('error', (err) => respond500(res, err));
                req.on('end', () => onInputEnd(context, chunks));
            } catch (e) {
                respond500(res, e);
            }
        } else {
            // Request method is not allowed.
            respond405(res);
        }

    }

    // COMPOSE RESULT
    Object.defineProperty(action, 'name', {value: `${NS}.${action.name}`});
    return action;
}

// MODULE'S EXPORT
Object.defineProperty(Factory, 'name', {value: `${NS}.${Factory.name}`});
export {
    Factory as default,
};
