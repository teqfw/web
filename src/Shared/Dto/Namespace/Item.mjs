/**
 * DI namespace item DTO in Service API.
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Shared_Dto_Namespace_Item';

// MODULE'S CLASSES
export default class TeqFw_Web_Shared_Dto_Namespace_Item {
    /**
     * Extension for ES6 modules ('mjs' or 'js').
     * @type {string}
     */
    ext;
    /**
     * Namespace ('Vendor_Project')
     * @type {string}
     */
    ns;
    /**
     * Path to the sources in URL ('/src/@vendor/prj').
     * (@see TeqFw_Web_Back_App_Server_Handler_Static)
     * @type {string}
     */
    path;
}

// attributes names to use as aliases in queries to RDb
TeqFw_Web_Shared_Dto_Namespace_Item.EXT = 'ext';
TeqFw_Web_Shared_Dto_Namespace_Item.NS = 'ns';
TeqFw_Web_Shared_Dto_Namespace_Item.PATH = 'path';

/**
 * Factory to create new DTO instances.
 * @memberOf TeqFw_Web_Shared_Dto_Namespace_Item
 */
export class Factory {
    constructor(spec) {
        const {castString} = spec['TeqFw_Core_Shared_Util_Cast'];

        /**
         * @param {TeqFw_Web_Shared_Dto_Namespace_Item|null} data
         * @return {TeqFw_Web_Shared_Dto_Namespace_Item}
         */
        this.create = function (data = null) {
            const res = new TeqFw_Web_Shared_Dto_Namespace_Item();
            res.ext = castString(data?.ext);
            res.ns = castString(data?.ns);
            res.path = castString(data?.path);
            return res;
        }
    }
}

// finalize code components for this es6-module
Object.freeze(TeqFw_Web_Shared_Dto_Namespace_Item);
Object.defineProperty(Factory, 'name', {value: `${NS}.${Factory.constructor.name}`});
