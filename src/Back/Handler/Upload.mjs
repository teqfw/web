/**
 * Web server handler to process file uploads requests.
 */
// MODULE'S IMPORT
import {constants as H2} from 'http2';

// MODULE'S VARS
const NS = 'TeqFw_Web_Back_Handler_Upload';
const {
    HTTP2_HEADER_CONTENT_TYPE,
    HTTP2_METHOD_POST,
    HTTP2_METHOD_GET,
    HTTP_STATUS_OK,
} = H2;

/**
 * @implements TeqFw_Web_Back_Api_Request_INewHandler
 */
export default class TeqFw_Web_Back_Handler_Upload {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Web_Back_Defaults} */
        const DEF = spec['TeqFw_Web_Back_Defaults$'];

        // DEFINE WORKING VARS / PROPS
        // DEFINE INNER FUNCTIONS

        /**
         * Process request if address space is equal to 'upload'.
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest}req
         * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} res
         */
        async function process(req, res) {
            // not implemented yet
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
