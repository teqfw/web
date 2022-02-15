/**
 * Simple service to check availability of the server from a front using GET request.
 *
 * @namespace TeqFw_Web_Back_WAPI_Alive
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Back_WAPI_Alive';

/**
 * @implements TeqFw_Web_Back_Api_WAPI_IFactory
 */
export default class TeqFw_Web_Back_WAPI_Alive {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Back_App_UUID} */
        const backUUID = spec['TeqFw_Core_Back_App_UUID$'];
        /** @type {TeqFw_Web_Shared_WAPI_Alive.Factory} */
        const route = spec['TeqFw_Web_Shared_WAPI_Alive#Factory$'];

        // DEFINE INSTANCE METHODS
        this.getRouteFactory = () => route;

        this.getService = function () {
            // ENCLOSED FUNCS
            /**
             * @param {TeqFw_Web_Back_App_Server_Handler_WAPI_Context} context
             */
            async function service(context) {
                /** @type {TeqFw_Web_Shared_WAPI_Alive.Response} */
                const res = context.getOutData();
                res.payload = backUUID.get();
            }

            // MAIN
            Object.defineProperty(service, 'name', {value: `${NS}.${service.name}`});
            return service;
        }
    }

}
