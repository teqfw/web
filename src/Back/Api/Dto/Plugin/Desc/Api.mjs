/**
 * DTO to represent plugin descriptor (teqfw.json) structure
 * that is related to 'web/api' node:
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Back_Api_Dto_Plugin_Desc_Api';

// MODULE'S CLASSES
class TeqFw_Web_Back_Api_Dto_Plugin_Desc_Api {
    /**
     * @type {string}
     * @deprecated use NPM package name as realm
     */
    realm;
    /** @type {string[]} */
    services;
}

// attributes names to use as aliases in queries to object props
TeqFw_Web_Back_Api_Dto_Plugin_Desc_Api.REALM = 'realm';
TeqFw_Web_Back_Api_Dto_Plugin_Desc_Api.SERVICES = 'services';

/**
 * Factory to create new DTO instances.
 * @memberOf TeqFw_Web_Back_Api_Dto_Plugin_Desc_Api
 */
class Factory {
    constructor() {
        /**
         * @param {TeqFw_Web_Back_Api_Dto_Plugin_Desc_Api|null} data
         * @return {TeqFw_Web_Back_Api_Dto_Plugin_Desc_Api}
         */
        this.create = function (data = null) {
            const res = new TeqFw_Web_Back_Api_Dto_Plugin_Desc_Api();
            res.realm = data?.realm;
            res.services = Array.isArray(data?.services) ? data.services : [];
            return res;
        }
    }
}

// freeze class to deny attributes changes then export class
Object.freeze(TeqFw_Web_Back_Api_Dto_Plugin_Desc_Api);
Object.defineProperty(Factory, 'name', {value: `${NS}.${Factory.constructor.name}`});
export {
    TeqFw_Web_Back_Api_Dto_Plugin_Desc_Api as default,
    Factory
} ;
