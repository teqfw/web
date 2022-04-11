/**
 * Web server handler to get configuration data.
 *
 * @namespace TeqFw_Web_Back_App_Server_Handler_Config
 */
// MODULE'S IMPORT
import {constants as H2} from 'http2';

// MODULE'S VARS
const NS = 'TeqFw_Web_Back_App_Server_Handler_Config';
const {
    HTTP2_METHOD_GET,
    HTTP_STATUS_OK,
} = H2;

// MODULE'S CLASSES
/**
 * @implements TeqFw_Web_Back_Api_Dispatcher_IHandler
 */
export default class TeqFw_Web_Back_App_Server_Handler_Config {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Web_Back_Defaults} */
        const DEF = spec['TeqFw_Web_Back_Defaults$'];
        /** @type {TeqFw_Core_Shared_Api_ILogger} */
        const logger = spec['TeqFw_Core_Shared_Api_ILogger$$']; // instance
        /** @type {TeqFw_Web_Back_Act_Di_Config|function} */
        const actDi = spec['TeqFw_Web_Back_Act_Di_Config$'];

        // VARS
        let _store;

        // FUNCS
        /**
         * Extract static file name from GET request, find file in filesystem then send it back to client.
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest}req
         * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} res
         */
        function process(req, res) {
            // FUNCS

            // MAIN
            /** @type {TeqFw_Core_Shared_Mod_Map} */
            const shares = res[DEF.HNDL_SHARE];
            const status = shares.get(DEF.SHARE_RES_STATUS);
            if (!res.headersSent && !status) {
                shares.set(DEF.SHARE_RES_BODY, JSON.stringify(_store));
                shares.set(DEF.SHARE_RES_STATUS, HTTP_STATUS_OK);
            }
        }

        // INSTANCE METHODS
        this.getProcessor = () => process;

        this.init = async function () {
            logger.info('Initialize configuration requests handler:');
            _store = await actDi();
            logger.info('\tDI container configuration is loaded into handler\'s cache.');
        };

        /**
         * @param {string} method
         * @param {TeqFw_Web_Back_Dto_Address} address
         * @return {boolean}
         */
        this.canProcess = function ({method, address} = {}) {
            return ((method === HTTP2_METHOD_GET) && (address.space === DEF.SHARED.SPACE_CFG));
        }

        // MAIN
        Object.defineProperty(process, 'namespace', {value: NS});
    }
}
