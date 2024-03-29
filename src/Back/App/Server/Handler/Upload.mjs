/**
 * Web server handler to process file uploads requests.
 * TODO: move this handler in standalone plugin
 */
// MODULE'S IMPORT
import {constants as H2} from 'http2';
import {join} from 'path';
import {createWriteStream, existsSync, mkdirSync} from 'fs';

// MODULE'S VARS
const NS = 'TeqFw_Web_Back_App_Server_Handler_Upload';
const {
    HTTP2_HEADER_CONTENT_TYPE,
    HTTP2_METHOD_POST,
    HTTP_STATUS_INTERNAL_SERVER_ERROR,
    HTTP_STATUS_OK,
} = H2;

const HEAD_FILENAME = 'teq-upload-filename'; // HTTP header to get uploading filename

/**
 * @implements TeqFw_Web_Back_Api_Dispatcher_IHandler
 */
export default class TeqFw_Web_Back_App_Server_Handler_Upload {
    /**
     * @param {TeqFw_Web_Back_Defaults} DEF
     * @param {TeqFw_Core_Back_Config} config
     */
    constructor(
        {
            TeqFw_Web_Back_Defaults$: DEF,
            TeqFw_Core_Back_Config$: config,
        }) {
        // VARS
        const _root = join(config.getPathToRoot(), DEF.DATA_DIR_UPLOAD);

        // FUNCS

        /**
         * Process request if address space is equal to 'upload'.
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest}req
         * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} res
         */
        async function process(req, res) {
            if (!res.headersSent) {
                /** @type {string} */
                const encoded = req.headers[HEAD_FILENAME];
                const filename = Buffer.from(encoded, 'base64').toString();
                const fullPath = join(_root, filename);
                if (fullPath.startsWith(_root)) {
                    return new Promise((resolve) => {
                        if (!existsSync(_root)) mkdirSync(_root, {recursive: true});
                        const ws = createWriteStream(fullPath);
                        req.pipe(ws);
                        ws.on('error', (e) => {
                            // respond with error and resolve the promise
                            res.writeHead(HTTP_STATUS_INTERNAL_SERVER_ERROR, {
                                [HTTP2_HEADER_CONTENT_TYPE]: 'text/plain'
                            });
                            res.write(`Upload is failed. Reason: ${e}`);
                            res.end();
                            resolve();
                        });
                        ws.on('close', () => {
                            // respond with error and resolve the promise
                            res.writeHead(HTTP_STATUS_OK, {
                                [HTTP2_HEADER_CONTENT_TYPE]: 'text/plain'
                            });
                            res.write(`Upload is done.`);
                            res.end();
                            resolve();
                        });
                    });

                }
            }
        }

        // INSTANCE METHODS
        this.getProcessor = () => process;

        this.init = async function () {
            // there is no initialization for this handler
        }

        this.canProcess = function ({method, address} = {}) {
            return (
                (method === HTTP2_METHOD_POST)
                && (address?.space === DEF.SHARED.SPACE_UPLOAD)
            );
        }

        // MAIN

        Object.defineProperty(process, 'namespace', {value: NS});
    }
}
