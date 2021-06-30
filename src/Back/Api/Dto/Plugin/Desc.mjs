/**
 * DTO to represent plugin descriptor (teqfw.json) structure
 * that is related to 'web' node:
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Back_Api_Dto_Plugin_Desc';

// MODULE'S CLASSES
class TeqFw_Web_Back_Api_Dto_Plugin_Desc {
    /** @type {TeqFw_Web_Back_Api_Dto_Plugin_Desc_Api} */
    api;
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
    spaces;
    /** @type {Object<string, string>} */
    statics;
}

// attributes names to use as aliases in queries to object props
TeqFw_Web_Back_Api_Dto_Plugin_Desc.DOORS = 'doors';
TeqFw_Web_Back_Api_Dto_Plugin_Desc.HANDLERS = 'handlers';
TeqFw_Web_Back_Api_Dto_Plugin_Desc.ROOT = 'root';
TeqFw_Web_Back_Api_Dto_Plugin_Desc.SPACES = 'spaces';
TeqFw_Web_Back_Api_Dto_Plugin_Desc.STATICS = 'statics';

/**
 * Factory to create new DTO instances.
 * @memberOf TeqFw_Web_Back_Api_Dto_Plugin_Desc
 */
class Factory {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {typeof TeqFw_Web_Back_Api_Dto_Plugin_Desc_Api} */
        const DApi = spec['TeqFw_Web_Back_Api_Dto_Plugin_Desc_Api#'];
        /** @type {TeqFw_Web_Back_Api_Dto_Plugin_Desc_Api.Factory} */
        const fApi = spec['TeqFw_Web_Back_Api_Dto_Plugin_Desc_Api#Factory$'];
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
            res.api = (data?.api instanceof DApi) ? data.api : fApi.create(data?.api);
            res.doors = Array.isArray(data?.doors) ? data.doors : [];
            res.handlers = Array.isArray(data?.handlers)
                ? data.handlers.map((one) => (one instanceof DHandler) ? one : fHandler.create(one))
                : [];
            res.root = data?.root;
            res.spaces = Array.isArray(data?.spaces) ? data.spaces : [];
            res.statics = data?.statics || {};
            return res;
        }
    }
}

// freeze class to deny attributes changes then export class
Object.freeze(TeqFw_Web_Back_Api_Dto_Plugin_Desc);
Object.defineProperty(Factory, 'name', {value: `${NS}.${Factory.constructor.name}`});
export {
    TeqFw_Web_Back_Api_Dto_Plugin_Desc as default,
    Factory
} ;
