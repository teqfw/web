/**
 * DTO to represent plugin descriptor (teqfw.json) structure
 * that is related to 'web' node:
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Back_Api_Dto_Plugin_Desc';

// MODULE'S CLASSES
export default class TeqFw_Web_Back_Api_Dto_Plugin_Desc {
    /**
     * Application frontend entrance points ('pub', 'admin', 'sign', ...).
     * This property is used in application level descriptors only.
     *
     * @type {string[]}
     */
    doors;
    /** @type {TeqFw_Web_Back_Api_Dto_Plugin_Desc_Handler[]} */
    handlers;
    /** @type {string} */
    root;
    /** @type {string[]} */
    services;
    /** @type {Object<string, string>} */
    statics;
}

// attributes names to use as aliases in queries to object props
TeqFw_Web_Back_Api_Dto_Plugin_Desc.DOORS = 'doors';
TeqFw_Web_Back_Api_Dto_Plugin_Desc.HANDLERS = 'handlers';
TeqFw_Web_Back_Api_Dto_Plugin_Desc.ROOT = 'root';
TeqFw_Web_Back_Api_Dto_Plugin_Desc.SERVICES = 'services';
TeqFw_Web_Back_Api_Dto_Plugin_Desc.STATICS = 'statics';

/**
 * Factory to create new DTO instances.
 * @memberOf TeqFw_Web_Back_Api_Dto_Plugin_Desc
 */
export class Factory {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {typeof TeqFw_Web_Back_Api_Dto_Plugin_Desc_Handler} */
        const DHandler = spec['TeqFw_Web_Back_Api_Dto_Plugin_Desc_Handler#'];
        /** @type {TeqFw_Web_Back_Api_Dto_Plugin_Desc_Handler.Factory} */
        const fHandler = spec['TeqFw_Web_Back_Api_Dto_Plugin_Desc_Handler#Factory$'];

        /**
         * @param {TeqFw_Web_Back_Api_Dto_Plugin_Desc|null} data
         * @return {TeqFw_Web_Back_Api_Dto_Plugin_Desc}
         */
        this.create = function (data = null) {
            const res = new TeqFw_Web_Back_Api_Dto_Plugin_Desc();
            res.doors = Array.isArray(data?.doors) ? data.doors : [];
            res.handlers = Array.isArray(data?.handlers)
                ? data.handlers.map((one) => (one instanceof DHandler) ? one : fHandler.create(one))
                : [];
            res.root = data?.root;
            res.services = Array.isArray(data?.services) ? data.services : [];
            res.statics = data?.statics || {};
            return res;
        }
    }
}

// freeze DTO class to deny attributes changes and pin namespace
Object.freeze(TeqFw_Web_Back_Api_Dto_Plugin_Desc);
Object.defineProperty(Factory, 'name', {value: `${NS}.${Factory.constructor.name}`});
