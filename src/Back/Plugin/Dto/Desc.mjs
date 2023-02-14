/**
 * DTO to represent plugin descriptor (teqfw.json) structure
 * that is related to '@teqfw/web' node:
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Back_Plugin_Dto_Desc';

/**
 * @memberOf TeqFw_Web_Back_Plugin_Dto_Desc
 * @type {Object}
 */
export const ATTR = {
    DOORS: 'doors',
    EXCLUDES: 'excludes',
    HANDLERS: 'handlers',
    SERVICES: 'services',
    SOCKETS: 'sockets',
    SSE: 'sse',
    STATICS: 'statics',
};
Object.freeze(ATTR);

// MODULE'S CLASSES
/**
 * @memberOf TeqFw_Web_Back_Plugin_Dto_Desc
 */
class Dto {
    static namespace = NS;
    /**
     * Application frontend entry points ('pub', 'admin', 'sign', ...).
     * This property should be used in application level descriptors only.
     *
     * @type {string[]}
     */
    doors;
    /**
     * Exclude some objects from processing.
     * This property should be used in application level descriptors only.
     * @type {TeqFw_Web_Back_Plugin_Dto_Desc_Excludes.Dto}
     */
    excludes;
    /** @type {Object<string, TeqFw_Web_Back_Plugin_Dto_Desc_Handler.Dto>} */
    handlers;
    /** @type {string[]} */
    services;
    /** @type {Object<string, TeqFw_Web_Back_Plugin_Dto_Desc_Socket.Dto>} */
    sockets;
    /** @type {string[]} */
    sse;
    /** @type {Object<string, string>} */
    statics;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto
 */
export default class TeqFw_Web_Back_Plugin_Dto_Desc {
    constructor(spec) {
        /** @type {TeqFw_Core_Shared_Util_Cast.castArrayOfStr|function} */
        const castArrayOfStr = spec['TeqFw_Core_Shared_Util_Cast.castArrayOfStr'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castObjectsMap|function} */
        const castObjectsMap = spec['TeqFw_Core_Shared_Util_Cast.castObjectsMap'];
        /** @type {TeqFw_Web_Back_Plugin_Dto_Desc_Handler} */
        const dtoHandler = spec['TeqFw_Web_Back_Plugin_Dto_Desc_Handler$'];
        /** @type {TeqFw_Web_Back_Plugin_Dto_Desc_Excludes} */
        const dtoExcludes = spec['TeqFw_Web_Back_Plugin_Dto_Desc_Excludes$'];
        /** @type {TeqFw_Web_Back_Plugin_Dto_Desc_Socket} */
        const dtoSocket = spec['TeqFw_Web_Back_Plugin_Dto_Desc_Socket$'];

        /**
         * @param {TeqFw_Web_Back_Plugin_Dto_Desc.Dto} [data]
         * @return {TeqFw_Web_Back_Plugin_Dto_Desc.Dto}
         */
        this.createDto = function (data) {
            // create new DTO
            const res = new Dto();
            // cast known attributes
            res.doors = castArrayOfStr(data?.doors);
            res.excludes = dtoExcludes.createDto(data?.excludes);
            res.handlers = castObjectsMap(data?.handlers, dtoHandler.createDto);
            res.services = castArrayOfStr(data?.services);
            res.sockets = castObjectsMap(data?.sockets, dtoSocket.createDto);
            res.sse = castArrayOfStr(data?.sse);
            res.statics = castObjectsMap(data?.statics);
            return res;
        }
    }
}
