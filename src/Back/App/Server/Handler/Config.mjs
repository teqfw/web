/**
 * Web server handler to allow the loading of configuration data by the fronts.
 *
 * @namespace TeqFw_Web_Back_App_Server_Handler_Config
 */
// MODULE'S IMPORT
import {constants as H2} from 'node:http2';

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
    /**
     * @param {TeqFw_Web_Back_Defaults} DEF
     * @param {TeqFw_Core_Shared_Api_Logger} logger -  instance
     * @param {TeqFw_Web_Back_App_Server_Handler_Config_A_Front|function} actFront
     * @param {TeqFw_Web_Back_App_Server_Handler_Config_A_Di|function} actDi
     * @param {TeqFw_Web_Back_Mod_Address} modAddr
     */
    constructor(
        {
            TeqFw_Web_Back_Defaults$: DEF,
            TeqFw_Core_Shared_Api_Logger$$: logger,
            TeqFw_Web_Back_App_Server_Handler_Config_A_Front$: actFront,
            TeqFw_Web_Back_App_Server_Handler_Config_A_Di$: actDi,
            TeqFw_Web_Back_Mod_Address$: modAddr,
        }
    ) {
        // VARS
        let _storeDi, _storeFront;

        // FUNCS
        /**
         * Extract static file name from GET request, find file in filesystem then send it back to client.
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest}req
         * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} res
         */
        function process(req, res) {
            /** @type {Object} */
            const shares = res[DEF.HNDL_SHARE];
            const status = shares[DEF.SHARE_RES_STATUS];
            if (!res.headersSent && !status) {
                const addr = modAddr.parsePath(req.url);
                if (addr.route === DEF.SHARED.CFG_DI) {
                    // return DI config
                    shares[DEF.SHARE_RES_BODY] = JSON.stringify(_storeDi);
                    shares[DEF.SHARE_RES_STATUS] = HTTP_STATUS_OK;
                } else if (addr.route.includes(DEF.SHARED.CFG_APP)) {
                    // return app config
                    shares[DEF.SHARE_RES_BODY] = JSON.stringify(_storeFront);
                    shares[DEF.SHARE_RES_STATUS] = HTTP_STATUS_OK;
                }
            }
        }

        // INSTANCE METHODS
        this.getProcessor = () => process;

        this.init = async function () {
            logger.info('Initialize configuration requests handler:');
            _storeDi = await actDi();
            logger.info('\tDI container configuration is loaded into handler\'s cache.');
            _storeFront = await actFront();
            logger.info('\tFrontend app configuration is loaded into handler\'s cache.');
        };

        /**
         * @param {string} method
         * @param {TeqFw_Web_Back_Dto_Address} address
         * @return {boolean}
         */
        this.canProcess = function ({method, address} = {}) {
            return ((method === HTTP2_METHOD_GET) && (address.space === DEF.SHARED.SPACE_CFG));
        };

        // MAIN
        Object.defineProperty(process, 'namespace', {value: NS});
    }
}
