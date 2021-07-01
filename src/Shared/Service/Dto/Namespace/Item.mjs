/**
 * DI namespace item DTO in Service API.
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Shared_Service_Dto_Namespace_Item';

// MODULE'S CLASSES
class TeqFw_Web_Shared_Service_Dto_Namespace_Item {
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
     * (@see TeqFw_Web_Plugin_Web_Handler_Static)
     * @type {string}
     */
    path;
}

// attributes names to use as aliases in queries to RDb
TeqFw_Web_Shared_Service_Dto_Namespace_Item.EXT = 'ext';
TeqFw_Web_Shared_Service_Dto_Namespace_Item.NS = 'ns';
TeqFw_Web_Shared_Service_Dto_Namespace_Item.PATH = 'path';

/**
 * Factory to create new DTO instances.
 * @memberOf TeqFw_Web_Shared_Service_Dto_Namespace_Item
 */
class Factory {
    constructor() {
        /**
         * @param {TeqFw_Web_Shared_Service_Dto_Namespace_Item|null} data
         * @return {TeqFw_Web_Shared_Service_Dto_Namespace_Item}
         */
        this.create = function (data = null) {
            const res = new TeqFw_Web_Shared_Service_Dto_Namespace_Item();
            res.ext = data?.ext;
            res.ns = data?.ns;
            res.path = data?.path;
            return res;
        }
    }
}

// freeze class to deny attributes changes then export class
Object.freeze(TeqFw_Web_Shared_Service_Dto_Namespace_Item);
Object.defineProperty(Factory, 'name', {value: `${NS}.${Factory.constructor.name}`});
export {
    TeqFw_Web_Shared_Service_Dto_Namespace_Item as default,
    Factory
} ;
