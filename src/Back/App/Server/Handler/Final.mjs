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
const NS = 'TeqFw_Web_Back_App_Server_Handler_Final';
const {
    HTTP2_HEADER_CONTENT_LENGTH,
    HTTP2_HEADER_CONTENT_TYPE,
    HTTP2_HEADER_SET_COOKIE,
    HTTP_STATUS_OK,
} = H2;

/**
 * @implements TeqFw_Web_Back_Api_Dispatcher_IHandler
 */
export default class TeqFw_Web_Back_App_Server_Handler_Final {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Web_Back_Defaults} */
        const DEF = spec['TeqFw_Web_Back_Defaults$'];
        /** @type {TeqFw_Web_Back_App_Server_Respond.respond404|function} */
        const respond404 = spec['TeqFw_Web_Back_App_Server_Respond.respond404'];

        // DEFINE INNER FUNCTIONS

        /**
         * Send 'Error 404' if response is not handled yet.
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest}req
         * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} res
         */
        function process(req, res) {
            if (!res.headersSent) {
                /** @type {TeqFw_Core_Shared_Mod_Map} */
                const shares = req[DEF.HNDL_SHARE];
                const headers = res.getHeaders();
                const statusCode = shares.get(DEF.SHARE_RES_STATUS) ?? HTTP_STATUS_OK;
                const file = shares.get(DEF.SHARE_RES_FILE);
                const body = shares.get(DEF.SHARE_RES_BODY);
                let stat;
                if (file && (statusCode === HTTP_STATUS_OK)) {
                    if (existsSync(file) && (stat = statSync(file)) && stat.isFile()) {
                        const mimeType = lookup(file) ?? 'application/octet-stream';
                        res.setHeader(HTTP2_HEADER_CONTENT_TYPE, mimeType);
                        res.setHeader(HTTP2_HEADER_CONTENT_LENGTH, stat.size);
                        res.setHeader(HTTP2_HEADER_SET_COOKIE, 'boobs=asses');
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
