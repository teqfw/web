/**
 * Collector to get logs from fronts.
 *
 * @namespace TeqFw_Web_Back_WAPI_Front_Log_Collect
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Back_WAPI_Front_Log_Collect';

/**
 * @implements TeqFw_Web_Back_Api_WAPI_IFactory
 */
export default class TeqFw_Web_Back_WAPI_Front_Log_Collect {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Web_Back_Defaults} */
        const DEF = spec['TeqFw_Web_Back_Defaults$'];
        /** @type {TeqFw_Web_Shared_WAPI_Front_Log_Collect.Factory} */
        const route = spec['TeqFw_Web_Shared_WAPI_Front_Log_Collect#Factory$'];
        /** @type {TeqFw_Core_Shared_Api_Logger_ITransport} */
        const loggerTransport = spec['TeqFw_Core_Shared_Api_Logger_ITransport$'];
        /** @type {TeqFw_Core_Shared_Dto_Log} */
        const dtoLog = spec['TeqFw_Core_Shared_Dto_Log$'];
        /** @type {typeof TeqFw_Web_Shared_Enum_Log_Type} */
        const TYPE = spec['TeqFw_Web_Shared_Enum_Log_Type$'];

        // DEFINE INSTANCE METHODS
        this.getRouteFactory = () => route;

        this.getService = function () {
            // ENCLOSED FUNCS
            /**
             * @param {TeqFw_Web_Back_App_Server_Handler_WAPI_Context} context
             */
            async function service(context) {
                /** @type {TeqFw_Web_Shared_WAPI_Front_Log_Collect.Request} */
                const req = context.getInData();
                /** @type {TeqFw_Web_Shared_WAPI_Front_Log_Collect.Response} */
                const res = context.getOutData();
                const dto = dtoLog.createDto(req.item);
                dto.meta[DEF.SHARED.LOG_META_TYPE] = TYPE.FRONT;
                loggerTransport.log(dto);
                res.success = true;
            }

            // MAIN
            Object.defineProperty(service, 'name', {value: `${NS}.${service.name}`});
            return service;
        }
    }

}
