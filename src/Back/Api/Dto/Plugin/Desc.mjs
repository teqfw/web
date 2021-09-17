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
    /** @type {Object<string, TeqFw_Web_Back_Api_Dto_Plugin_Desc_Handler>} */
    handlers;
    /** @type {string[]} */
    services;
    /** @type {Object<string, string>} */
    statics;
}

// attributes names to use as aliases in queries to object props
TeqFw_Web_Back_Api_Dto_Plugin_Desc.DOORS = 'doors';
TeqFw_Web_Back_Api_Dto_Plugin_Desc.HANDLERS = 'handlers';
TeqFw_Web_Back_Api_Dto_Plugin_Desc.SERVICES = 'services';
TeqFw_Web_Back_Api_Dto_Plugin_Desc.STATICS = 'statics';

/**
 * Factory to create new DTO instances.
 * @memberOf TeqFw_Web_Back_Api_Dto_Plugin_Desc
 */
export class Factory {
    constructor(spec) {
        const {castArray} = spec['TeqFw_Core_Shared_Util_Cast'];
        /** @type {TeqFw_Web_Back_Api_Dto_Plugin_Desc_Handler.Factory} */
        const fHandler = spec['TeqFw_Web_Back_Api_Dto_Plugin_Desc_Handler#Factory$'];

        /**
         * @param {TeqFw_Web_Back_Api_Dto_Plugin_Desc|null} data
         * @return {TeqFw_Web_Back_Api_Dto_Plugin_Desc}
         */
        this.create = function (data = null) {
            // DEFINE INNER FUNCTIONS
            function parseHandlers(data) {
                const res = {};
                if (typeof data === 'object')
                    for (const key of Object.keys(data))
                        res[key] = fHandler.create(data[key]);
                return res;
            }

            // MAIN FUNCTIONALITY
            const res = new TeqFw_Web_Back_Api_Dto_Plugin_Desc();
            res.doors = castArray(data?.doors);
            res.handlers = parseHandlers(data?.handlers);
            res.services = castArray(data?.services);
            res.statics = Object.assign({}, data?.statics);
            return res;
        }
    }
}

// freeze DTO class to deny attributes changes and pin namespace
Object.freeze(TeqFw_Web_Back_Api_Dto_Plugin_Desc);
Object.defineProperty(Factory, 'name', {value: `${NS}.${Factory.constructor.name}`});
