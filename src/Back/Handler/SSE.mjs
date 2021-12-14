/**
 * Web server handler to process file uploads requests.
 */
// MODULE'S IMPORT
import {constants as H2} from 'http2';
import {join} from 'path';
import {createWriteStream, readdirSync} from 'fs';

// MODULE'S VARS
const NS = 'TeqFw_Web_Back_Handler_SSE';
const {
    HTTP2_HEADER_CACHE_CONTROL,
    HTTP2_HEADER_CONTENT_TYPE,
    HTTP2_METHOD_GET,
    HTTP2_METHOD_POST,
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
export default class TeqFw_Web_Back_Handler_SSE {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Web_Back_Defaults} */
        const DEF = spec['TeqFw_Web_Back_Defaults$'];
        /** @type {TeqFw_Core_Back_Config} */
        const config = spec['TeqFw_Core_Back_Config$'];
        /** @type {TeqFw_Web_Back_Model_Address} */
        const mAddress = spec['TeqFw_Web_Back_Model_Address$'];
        // TODO: DUPLO code is used
        /** @type {Fl32_Dup_Back_Handler_SSE_Registry} */
        const registry = spec['Fl32_Dup_Back_Handler_SSE_Registry$'];
        /** @type {Fl32_Dup_Shared_SSE_Authorize} */
        const dtoAuth = spec['Fl32_Dup_Shared_SSE_Authorize$'];
        /** @type {Fl32_Dup_Back_Handler_SSE_DTO_Registry_Item} */
        const metaDtoRegItem = spec['Fl32_Dup_Back_Handler_SSE_DTO_Registry_Item$'];


        // DEFINE WORKING VARS / PROPS
        const _root = join(config.getBoot().projectRoot, DEF.DATA_DIR_UPLOAD);

        // DEFINE INNER FUNCTIONS

        /**
         * Process request if address space is equal to 'upload'.
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest}req
         * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} res
         */
        async function process(req, res) {
            if (!res.headersSent && !res[DEF.RES_STATUS]) {
                // create functions to process outgoing events for this connection
                function respond(payload, msgId, event) {
                    if (event) res.write(`event: ${event}\n`);
                    res.write(`data: ${JSON.stringify(payload)}\n\n`);
                }

                // ... function to close SSE connection (if it is opened)
                function close(payload) {
                    res.end(payload);
                }

                // save connection data to SSE registry
                const item = metaDtoRegItem.createDto();
                item.respond = respond;
                item.close = close;
                item.messageId = 1;
                const connId = registry.add(item);

                // add handler to remove closed connection from registry
                res.addListener('close', () => {
                    registry.remove(connId);
                });


                res.writeHead(HTTP_STATUS_OK, {
                    [HTTP2_HEADER_CONTENT_TYPE]: 'text/event-stream',
                    [HTTP2_HEADER_CACHE_CONTROL]: 'no-cache',
                });

                return new Promise((resolve, reject) => {
                    const auth = dtoAuth.createDto();
                    auth.connectionId = connId;
                    auth.payload = 'useItOrRemoveIt!';
                    registry.sendMessage(connId, auth, 'authorize');
                    // close connection if not authorized
                    setTimeout(() => {
                        if (item.state === undefined) {
                            item.close();
                            console.log(`Connection '${item.connectionId}' is not authorized and is cosed by timeout.`);
                        }
                    }, 5000);
                });


            }
        }

        // DEFINE INSTANCE METHODS
        this.getProcessor = () => process;

        this.init = async function () {
            // there is not initialization for this handler yet
        }

        this.requestIsMine = function ({method, address} = {}) {
            return (
                (method === HTTP2_METHOD_GET)
                && (address?.space === DEF.SHARED.SPACE_SSE)
            );
        }

        // MAIN FUNCTIONALITY

        Object.defineProperty(process, 'name', {value: `${NS}.${process.name}`});
    }
}
