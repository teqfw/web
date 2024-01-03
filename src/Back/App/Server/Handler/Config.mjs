/**
 * Web server handler to allow the loading of configuration data by the fronts.
 *
 * @namespace TeqFw_Web_Back_App_Server_Handler_Config
 */
// MODULE'S IMPORT
import {constants as H2} from 'node:http2';
import {join} from 'node:path';

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
     * @param {TeqFw_Core_Back_Config} config
     * @param {TeqFw_Web_Back_App_Server_Handler_Config_A_Front|function} actApp
     * @param {TeqFw_Web_Back_App_Server_Handler_Config_A_Di|function} actDi
     * @param {TeqFw_Web_Back_App_Server_Handler_Config_A_SwCache|function} actSwCache
     * @param {TeqFw_Web_Back_Mod_Address} modAddr
     */
    constructor(
        {
            TeqFw_Web_Back_Defaults$: DEF,
            TeqFw_Core_Shared_Api_Logger$$: logger,
            TeqFw_Core_Back_Config$: config,
            TeqFw_Web_Back_App_Server_Handler_Config_A_Front$: actApp,
            TeqFw_Web_Back_App_Server_Handler_Config_A_Di$: actDi,
            TeqFw_Web_Back_App_Server_Handler_Config_A_SwCache$: actSwCache,
            TeqFw_Web_Back_Mod_Address$: modAddr,
        }) {
        // VARS
        let _storeDi, _storeApp, _storeSwCache;
        const ZIP = join(config.getPathToRoot(), DEF.SHARED.FILE_SW_CACHE_ZIP);

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
                    shares[DEF.SHARE_RES_BODY] = JSON.stringify(_storeApp);
                    shares[DEF.SHARE_RES_STATUS] = HTTP_STATUS_OK;
                } else if (addr.route.includes(DEF.SHARED.CFG_SW_CACHE)) {
                    // return SW cache config
                    shares[DEF.SHARE_RES_FILE] = ZIP;
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
            _storeApp = await actApp();
            logger.info('\tFrontend app configuration is loaded into handler\'s cache.');
            _storeSwCache = await actSwCache();
            logger.info('\tSW cache configuration is loaded into handler\'s cache.');
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
