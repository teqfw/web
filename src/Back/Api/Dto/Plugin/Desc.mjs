/**
 * DTO to represent plugin descriptor (teqfw.json) structure
 * that is related to 'web' node:
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Back_Api_Dto_Plugin_Desc';

// MODULE'S CLASSES
class TeqFw_Web_Back_Api_Dto_Plugin_Desc {
    /** @type {TeqFw_Web_Back_Api_Dto_Plugin_Desc_Handler[]} */
    handlers;
    /** @type {Object<string, string>} */
    statics;
}

/**
 * Factory to create new DTO instances.
 * @memberOf TeqFw_Web_Back_Api_Dto_Plugin_Desc
 */
class Factory {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {typeof TeqFw_Web_Back_Api_Dto_Plugin_Desc_Handler} */
        const DHandler = spec['TeqFw_Web_Back_Api_Dto_Plugin_Desc_Handler#']; // class
        /** @type {TeqFw_Web_Back_Api_Dto_Plugin_Desc_Handler.Factory} */
        const fHandler = spec['TeqFw_Web_Back_Api_Dto_Plugin_Desc_Handler#Factory$']; // singleton

        /**
         * @param {TeqFw_Web_Back_Api_Dto_Plugin_Desc|null} data
         * @return {TeqFw_Web_Back_Api_Dto_Plugin_Desc}
         */
        this.create = function (data = null) {
            const res = new TeqFw_Web_Back_Api_Dto_Plugin_Desc();
            res.handlers = Array.isArray(data?.handlers)
                ? data.handlers.map((one) => (one instanceof DHandler) ? one : fHandler.create(one))
                : [];
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
