/**
 * Web server handler to process file uploads requests.
 */
// MODULE'S IMPORT
import {constants as H2} from 'http2';
import {join} from 'path';
import {createWriteStream} from 'fs';

// MODULE'S VARS
const NS = 'TeqFw_Web_Back_Handler_Upload';
const {
    HTTP2_HEADER_CONTENT_TYPE,
    HTTP2_METHOD_POST,
    HTTP2_METHOD_GET,
    HTTP_STATUS_OK,
} = H2;

const HEAD_FILENAME = 'teq-upload-filename'; // HTTP header to get uploading filename
const SSE_CLOSE = 'close'; // SSE marker that connection is closed
const URL_REMOVE = '/remove/';
const URL_SSE = '/sse/';
const URL_UPLOAD = '/upload/';

/**
 * @implements TeqFw_Web_Back_Api_Request_INewHandler
 */
export default class TeqFw_Web_Back_Handler_Upload {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Web_Back_Defaults} */
        const DEF = spec['TeqFw_Web_Back_Defaults$'];
        /** @type {TeqFw_Core_Back_Config} */
        const config = spec['TeqFw_Core_Back_Config$'];
        /** @type {TeqFw_Web_Back_Model_Address} */
        const mAddress = spec['TeqFw_Web_Back_Model_Address$'];

        // DEFINE WORKING VARS / PROPS
        const _root = join(config.getBoot().projectRoot, DEF.DATA_DIR_UPLOAD);

        // DEFINE INNER FUNCTIONS

        /**
         * Process request if address space is equal to 'upload'.
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest}req
         * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} res
         */
        async function process(req, res) {
            // TODO: use address model here
            const {method, url} = req;
            const address = mAddress.parsePath(url);
            if (!res.headersSent
                && (method === HTTP2_METHOD_POST)
                && (address?.space === DEF.SHARED.SPACE_UPLOAD)
            ) {
                /** @type {string} */
                const encoded = req.headers[HEAD_FILENAME];
                const filename = Buffer.from(encoded, 'base64').toString();
                const fullPath = join(_root, filename);
                if (fullPath.startsWith(_root)) {
                    const ws = createWriteStream(fullPath);
                    req.pipe(ws);
                }
                res.writeHead(HTTP_STATUS_OK, {
                    [HTTP2_HEADER_CONTENT_TYPE]: 'text/plain'
                });
                res.end('Upload is done.');
            }
        }

        // DEFINE INSTANCE METHODS
        this.getProcessor = () => process;

        this.init = async function () {
            // there is not initialization for this handler
        }

        this.requestIsMine = function ({method, address, headers} = {}) {
            return (
                (method === HTTP2_METHOD_POST)
                && (address?.space === DEF.SHARED.SPACE_UPLOAD)
            );
        }

        // MAIN FUNCTIONALITY

        Object.defineProperty(process, 'name', {value: `${NS}.${process.name}`});
    }
}
