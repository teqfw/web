/**
 * Load configuration to the front.
 *
 * @namespace TeqFw_Web_Back_WAPI_Load_Config
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Back_WAPI_Load_Config';

/**
 * @implements TeqFw_Web_Back_Api_WAPI_IFactory
 */
export default class TeqFw_Web_Back_WAPI_Load_Config {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Web_Back_Defaults} */
        const DEF = spec['TeqFw_Web_Back_Defaults$'];
        /** @type {TeqFw_Core_Back_Config} */
        const config = spec['TeqFw_Core_Back_Config$'];
        /** @type {TeqFw_Web_Shared_WAPI_Load_Config.Factory} */
        const route = spec['TeqFw_Web_Shared_WAPI_Load_Config#Factory$'];

        // DEFINE INSTANCE METHODS
        this.getRouteFactory = () => route;

        this.getService = function () {
            // DEFINE INNER FUNCTIONS
            /**
             *
             * @param {TeqFw_Web_Back_Server_Handler_WAPI_Context} context
             * @return {Promise<void>}
             */
            async function service(context) {
                /** @type {TeqFw_Web_Shared_WAPI_Load_Config.Response} */
                const out = context.getOutData();
                // put web part of the local configuration to the out
                /** @type {TeqFw_Web_Back_Dto_Config_Local} */
                const webCfg = config.getLocal(DEF.SHARED.NAME);
                Object.assign(out, webCfg);
            }

            // MAIN FUNCTIONALITY
            Object.defineProperty(service, 'name', {value: `${NS}.${service.name}`});
            return service;
        }
    }

}
