/**
 * Web server handler to process requests to Server Sent Events handlers.
 */
// MODULE'S IMPORT
import {constants as H2} from 'http2';

// MODULE'S VARS
const NS = 'TeqFw_Web_Back_Handler_SSE';
const {
    HTTP2_METHOD_GET,
} = H2;

/**
 * @implements TeqFw_Web_Back_Api_Request_IHandler
 */
export default class TeqFw_Web_Back_Handler_SSE {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Web_Back_Defaults} */
        const DEF = spec['TeqFw_Web_Back_Defaults$'];
        /** @type {TeqFw_Di_Shared_Container} */
        const container = spec['TeqFw_Di_Shared_Container$'];
        /** @type {TeqFw_Core_Shared_Logger} */
        const logger = spec['TeqFw_Core_Shared_Logger$'];
        /** @type {TeqFw_Core_Back_Scan_Plugin_Registry} */
        const regPlugins = spec['TeqFw_Core_Back_Scan_Plugin_Registry$'];
        /** @type {TeqFw_Web_Back_Dto_Plugin_Desc.Factory} */
        const fDesc = spec['TeqFw_Web_Back_Dto_Plugin_Desc#Factory$'];

        // DEFINE WORKING VARS / PROPS
        /** @type {Fl32_Dup_Back_SSE_Stream} */
        let _service; // TODO: tmp solution has one handler for app only

        // DEFINE INNER FUNCTIONS

        /**
         * Process request if address space is equal to 'upload'.
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest}req
         * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} res
         */
        async function process(req, res) {
            if (!res.headersSent && !res[DEF.RES_STATUS]) {
                return _service.act(req, res);
            }
        }

        // DEFINE INSTANCE METHODS
        this.getProcessor = () => process;

        this.init = async function () {
            logger.info(`Initialize SSE web requests handler:`);
            const plugins = regPlugins.items();
            for (const one of plugins) {
                const data = one.teqfw?.[DEF.SHARED.NAME];
                if (data) {
                    const desc = fDesc.create(data);
                    const items = desc.sse;
                    if (items?.length) {
                        for (const moduleId of items) {
                            const service = await container.get(`${moduleId}$`);
                            if (!_service) {
                                _service = service;
                                logger.info(`    SSE service: ${moduleId}`);
                            } else {
                                let msg = 'SSE web requests handler can have one service only for now.';
                                msg = `${msg} Second service '${moduleId}' is rejected.`;
                                throw new Error(msg);
                            }
                        }
                    }
                }
            }
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
