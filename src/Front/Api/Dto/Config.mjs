/**
 * Frontend configuration DTO.
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Front_Api_Dto_Config';

// MODULE'S CLASSES
class TeqFw_Web_Front_Api_Dto_Config {
    /**
     * Current frontend door (pub, admin, ...) is configured on frontend (index.html).
     * @type {string}
     */
    door;
    /**
     * Root for teq-application (empty by default) is configured on the server side (./cfg/local.json).
     * @type {string}
     */
    root;
    /**
     * Base URL for frontend ('site.domain.com') is configured on the server side (./cfg/local.json).
     * @type {string}
     */
    urlBase;
}

/**
 * Factory to create new DTO instances.
 * @memberOf TeqFw_Web_Front_Api_Dto_Config
 */
class Factory {
    constructor() {
        /**
         * @param {TeqFw_Web_Front_Api_Dto_Config|null} data
         * @return {TeqFw_Web_Front_Api_Dto_Config}
         */
        this.create = function (data = null) {
            const res = new TeqFw_Web_Front_Api_Dto_Config();
            res.door = data?.door;
            res.root = data?.root;
            res.urlBase = data?.urlBase;
            return res;
        }
    }
}

// finalize code components for this es6-module
Object.freeze(TeqFw_Web_Front_Api_Dto_Config);
Object.defineProperty(Factory, 'name', {value: `${NS}.${Factory.constructor.name}`});
export {
    TeqFw_Web_Front_Api_Dto_Config as default,
    Factory
} ;
