/**
 * Web server handler to final processing of the request.
 * Handler analyze `res` structure and sends HTTP headers and body if its present or sends HTTP status 404.
 */
// MODULE'S IMPORT
import {lookup} from 'mime-types';
import {createReadStream, existsSync, statSync} from 'node:fs';
import {pipeline} from 'node:stream';
import {constants as H2} from 'node:http2';

// MODULE'S VARS
const NS = 'TeqFw_Web_Back_App_Server_Handler_Final';
const {
    HTTP2_HEADER_CONTENT_LENGTH,
    HTTP2_HEADER_CONTENT_TYPE,
    HTTP_STATUS_NOT_FOUND,
    HTTP_STATUS_OK,
} = H2;

/**
 * @implements TeqFw_Web_Back_Api_Dispatcher_IHandler
 */
export default class TeqFw_Web_Back_App_Server_Handler_Final {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Web_Back_Defaults} */
        const DEF = spec['TeqFw_Web_Back_Defaults$'];
        /** @type {TeqFw_Web_Back_App_Server_Respond.respond404|function} */
        const respond404 = spec['TeqFw_Web_Back_App_Server_Respond.respond404'];

        // FUNCS

        /**
         * Send 'Error 404' if response is not handled yet.
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest}req
         * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} res
         */
        function process(req, res) {
            if (!res.headersSent) {
                /** @type {Object} */
                const shares = req[DEF.HNDL_SHARE];
                const headers = res.getHeaders();
                const statusCode = shares[DEF.SHARE_RES_STATUS] ?? HTTP_STATUS_NOT_FOUND;
                const file = shares[DEF.SHARE_RES_FILE];
                const body = shares[DEF.SHARE_RES_BODY];
                let stat;
                if (file && (statusCode === HTTP_STATUS_OK)) {
                    if (existsSync(file) && (stat = statSync(file)) && stat.isFile()) {
                        const mimeType = lookup(file) ?? 'application/octet-stream';
                        res.setHeader(HTTP2_HEADER_CONTENT_TYPE, mimeType);
                        res.setHeader(HTTP2_HEADER_CONTENT_LENGTH, stat.size);
                        // return file content
                        const readStream = createReadStream(file);
                        res.writeHead(statusCode, headers);
                        // TODO: add error hndl
                        pipeline(readStream, res, (err) => {
                            const bp = true;
                        });
                    } else respond404(res);
                } else if (body) {
                    res.writeHead(statusCode, headers);
                    res.end(body);
                } else if (statusCode === HTTP_STATUS_OK) {
                    res.writeHead(statusCode, headers);
                    res.end();
                } else respond404(res);
            }
        }

        // INSTANCE METHODS

        this.canProcess = ({}) => true;

        this.getProcessor = () => process;

        this.init = async function () {};

        // MAIN
        Object.defineProperty(process, 'namespace', {value: NS});
    }
}
