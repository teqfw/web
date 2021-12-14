/**
 * Handler to process 'request' events.
 *
 * @namespace TeqFw_Web_Back_Server_Event_RequestNew
 */
// MODULE'S IMPORT
import {createReadStream, createWriteStream, existsSync} from 'fs';
import {constants as H2} from 'http2';
import {pipeline, Readable, Writable} from 'stream';
import sb from 'stream-buffers';
import MemoryStream from 'memorystream';
import {join} from "path";
import {rm} from "fs/promises";

const {
    HTTP2_HEADER_ALLOW,
    HTTP2_HEADER_CONTENT_TYPE,
    HTTP2_HEADER_CONTENT_LENGTH,
    HTTP2_METHOD_GET,
    HTTP2_METHOD_HEAD,
    HTTP2_METHOD_POST,
    HTTP_STATUS_OK,
    HTTP_STATUS_METHOD_NOT_ALLOWED,
    HTTP_STATUS_NOT_FOUND,
} = H2;

// MODULE'S VARS
const NS = 'TeqFw_Web_Back_Server_Event_RequestNew';

// MODULE'S FUNCTIONS
/**
 * Factory to setup execution context and to create the handler.
 *
 * @param {TeqFw_Di_Shared_SpecProxy} spec
 * @memberOf TeqFw_Web_Back_Server_Event_RequestNew
 */
export default function Factory(spec) {
    // EXTRACT DEPS
    /** @type {TeqFw_Web_Back_Defaults} */
    const DEF = spec['TeqFw_Web_Back_Defaults$'];
    /** @type {TeqFw_Core_Shared_Logger} */
    const logger = spec['TeqFw_Core_Shared_Logger$'];
    /** @type {TeqFw_Core_Back_Config} */
    const config = spec['TeqFw_Core_Back_Config$'];
    /** @type {TeqFw_Web_Back_Server_Respond.respond404|function} */
    const respond404 = spec['TeqFw_Web_Back_Server_Respond.respond404'];
    /** @type {TeqFw_Web_Back_Server_Respond.respond405|function} */
    const respond405 = spec['TeqFw_Web_Back_Server_Respond.respond405'];
    /** @type {TeqFw_Web_Back_Handler_Static} */
    const hndlStatic = spec['TeqFw_Web_Back_Handler_Static$'];
    /** @type {TeqFw_Web_Back_Handler_Upload} */
    const hndlUpload = spec['TeqFw_Web_Back_Handler_Upload$'];
    /** @type {TeqFw_Web_Back_Handler_SSE} */
    const hndlSSE = spec['TeqFw_Web_Back_Handler_SSE$'];
    /** @type {TeqFw_Web_Back_Handler_Final} */
    const hndlFinal = spec['TeqFw_Web_Back_Handler_Final$'];
    /** @type {TeqFw_Web_Back_Model_Address} */
    const mAddress = spec['TeqFw_Web_Back_Model_Address$'];

    // DEFINE WORKING VARS / PROPS
    const _root = join(config.getBoot().projectRoot, DEF.DATA_DIR_UPLOAD);

    // DEFINE INNER FUNCTIONS

    /**
     * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest}req
     * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} res
     * @return {Promise<void>}
     */
    async function processApi(req, res) {
        const {method, url} = req;
        const address = mAddress.parsePath(url);
        if (!res.headersSent
            && (method === HTTP2_METHOD_POST)
            && (address?.route === '/remove/')
        ) {
            const body = req[DEF.REQ_BODY_JSON];
            let total = 0;
            for (const filename of body.files) {
                const fullPath = join(_root, filename);
                if (
                    fullPath.startsWith(_root) && existsSync(fullPath)
                ) {
                    await rm(fullPath);
                    total++;
                }
            }
            res.writeHead(HTTP_STATUS_OK, {
                [HTTP2_HEADER_CONTENT_TYPE]: 'text/plain'
            });
            res.end(`Total removed: ${total} files.`);
        }


    }

    /**
     * Read input data, process requested operation, send results back.
     * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest}req
     * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} res
     * @returns {Promise<void>}
     * @memberOf TeqFw_Web_Back_Server_Event_RequestNew
     */
    async function action(req, res) {

        // DEFINE INNER FUNCTIONS

        function isMethodAllowed(method) {
            return (method === HTTP2_METHOD_HEAD)
                || (method === HTTP2_METHOD_GET)
                || (method === HTTP2_METHOD_POST);
        }

        /**
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest}req
         * @return {Promise<string>}
         */
        async function readBody(req) {
            const contentLength = req.headers[HTTP2_HEADER_CONTENT_LENGTH] ?? '';
            const initialSize = Number.parseInt(contentLength) || sb.DEFAULT_INITIAL_SIZE;
            const buf = new sb.WritableStreamBuffer({initialSize});

            return new Promise((resolve, reject) => {
                req.pipe(buf);
                req.on('error', reject);
                req.on('end', () => resolve(buf.getContentsAsString()));
            });
        }

        // MAIN FUNCTIONALITY
        const {method, url, headers} = req;
        // check HTTP method
        if (isMethodAllowed(method)) {
            // should we process body of the input message?
            if (method === HTTP2_METHOD_POST) {
                const contentType = headers[HTTP2_HEADER_CONTENT_TYPE] ?? '';
                if (contentType.startsWith('application/json')) {
                    const body = await readBody(req);
                    req[DEF.REQ_BODY_JSON] = JSON.parse(body);
                } else if (contentType.startsWith('text/plain')) {
                    req[DEF.REQ_BODY] = await readBody(req);
                }
            }
            // all processing for message body is done
            const sse = hndlSSE.getProcessor();
            const upload = hndlUpload.getProcessor();
            const stat = hndlStatic.getProcessor();
            const final = hndlFinal.getProcessor();
            await sse(req, res);
            await processApi(req, res);
            await upload(req, res);
            await stat(req, res);
            await final(req, res);

        } else respond405(res);
    }

    // COMPOSE RESULT
    Object.defineProperty(action, 'name', {value: `${NS}.${action.name}`});
    return action;
}

// finalize code components for this es6-module
Object.defineProperty(Factory, 'name', {value: `${NS}.${Factory.name}`});
