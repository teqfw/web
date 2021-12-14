/**
 * Web server handler to final processing of the request.
 * Handler analyze `res` structure and sends HTTP headers and body if its present or sends HTTP status 404.
 */
// MODULE'S IMPORT
import {lookup} from 'mime-types';
import {createReadStream, existsSync, statSync} from 'fs';
import {pipeline} from 'stream';
import {constants as H2} from "http2";

// MODULE'S VARS
const NS = 'TeqFw_Web_Back_Handler_Final';
const {
    HTTP2_HEADER_CONTENT_LENGTH,
    HTTP2_HEADER_CONTENT_TYPE,
    HTTP_STATUS_OK,
} = H2;

/**
 * @implements TeqFw_Web_Back_Api_Request_INewHandler
 */
export default class TeqFw_Web_Back_Handler_Final {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Web_Back_Defaults} */
        const DEF = spec['TeqFw_Web_Back_Defaults$'];
        /** @type {TeqFw_Web_Back_Server_Respond.respond404|function} */
        const respond404 = spec['TeqFw_Web_Back_Server_Respond.respond404'];

        // DEFINE INNER FUNCTIONS

        /**
         * Send 'Error 404' if response is not handled yet.
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest}req
         * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} res
         */
        function process(req, res) {
            if (!res.headersSent) {
                const statusCode = res[DEF.RES_STATUS] ?? HTTP_STATUS_OK;
                const file = res[DEF.RES_FILE];
                let stat;
                if (file) {
                    if (existsSync(file) && (stat = statSync(file)) && stat.isFile()) {
                        const mimeType = lookup(file) ?? 'application/octet-stream';
                        res.setHeader(HTTP2_HEADER_CONTENT_TYPE, mimeType);
                        res.setHeader(HTTP2_HEADER_CONTENT_LENGTH, stat.size);
                        // return file content
                        const readStream = createReadStream(file);
                        const headers = res.getHeaders();
                        res.writeHead(statusCode, headers);
                        // TODO: add erroro hndl
                        pipeline(readStream, res, (err) => {if (err) console.dir(err)});
                    }
                } else {
                    const headers = res.getHeaders();
                    res.writeHead(statusCode, headers);
                    res.end(res[DEF.RES_BODY]);
                }
                respond404(res);
            }
        }

        // DEFINE INSTANCE METHODS
        this.getProcessor = () => process;

        this.init = async function () {}

        this.requestIsMine = function ({}) {
            return true;
        }

        // MAIN FUNCTIONALITY
        Object.defineProperty(process, 'name', {value: `${NS}.${process.name}`});
    }
}
