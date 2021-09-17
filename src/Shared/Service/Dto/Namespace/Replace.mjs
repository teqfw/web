/**
 * DI namespace replace DTO in Service API.
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Shared_Service_Dto_Namespace_Replace';

// MODULE'S CLASSES
export default class TeqFw_Web_Shared_Service_Dto_Namespace_Replace {
    /**
     * Logical name for ES6 module with replacement code (Vnd_Plug_Implementation).
     * @type {string}
     */
    alter;
    /**
     * Logical name for original ES6 module (Vnd_Plug_Interface).
     * @type {string}
     */
    orig;
}

// attributes names to use as aliases in queries to RDb
TeqFw_Web_Shared_Service_Dto_Namespace_Replace.ALTER = 'alter';
TeqFw_Web_Shared_Service_Dto_Namespace_Replace.ORIG = 'orig';

/**
 * Factory to create new DTO instances.
 * @memberOf TeqFw_Web_Shared_Service_Dto_Namespace_Replace
 */
export class Factory {
    constructor(spec) {
        const {castString} = spec['TeqFw_Core_Shared_Util_Cast'];

        /**
         * @param {TeqFw_Web_Shared_Service_Dto_Namespace_Replace|null} data
         * @return {TeqFw_Web_Shared_Service_Dto_Namespace_Replace}
         */
        this.create = function (data = null) {
            const res = new TeqFw_Web_Shared_Service_Dto_Namespace_Replace();
            res.alter = castString(data?.alter);
            res.orig = castString(data?.orig);
            return res;
        }
    }
}

// finalize code components for this es6-module
Object.freeze(TeqFw_Web_Shared_Service_Dto_Namespace_Replace);
Object.defineProperty(Factory, 'name', {value: `${NS}.${Factory.constructor.name}`});
