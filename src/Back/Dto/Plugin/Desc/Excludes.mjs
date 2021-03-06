/**
 * DTO to describe excludes for web request handlers, WAPI services, etc.
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Back_Dto_Plugin_Desc_Excludes';

// MODULE'S CLASSES
export default class TeqFw_Web_Back_Dto_Plugin_Desc_Excludes {
    /**
     * List of handlers (namespaces only) to exclude from processing.
     *
     * @type {string[]}
     */
    handlers;
    /**
     * List of folders to be excluded from SW cache.
     *
     * @type {string[]}
     */
    swCache;
    /**
     * List of WAPI services (namespaces only) to exclude from processing.
     *
     * @type {string[]}
     */
    wapi;
}

// attributes names to use as aliases in queries to object props
TeqFw_Web_Back_Dto_Plugin_Desc_Excludes.HANDLERS = 'handlers';
TeqFw_Web_Back_Dto_Plugin_Desc_Excludes.WAPI = 'wapi';

/**
 * Factory to create new DTO instances.
 * @memberOf TeqFw_Web_Back_Dto_Plugin_Desc_Excludes
 */
export class Factory {
    static namespace = NS;

    constructor(spec) {
        /** @type {TeqFw_Core_Shared_Util_Cast.castArrayOfStr|function} */
        const castArrayOfStr = spec['TeqFw_Core_Shared_Util_Cast.castArrayOfStr'];

        /**
         * @param {TeqFw_Web_Back_Dto_Plugin_Desc_Excludes|null} data
         * @return {TeqFw_Web_Back_Dto_Plugin_Desc_Excludes}
         */
        this.create = function (data = null) {
            const res = new TeqFw_Web_Back_Dto_Plugin_Desc_Excludes();
            res.handlers = castArrayOfStr(data?.handlers);
            res.swCache = castArrayOfStr(data?.swCache);
            res.wapi = castArrayOfStr(data?.wapi);
            return res;
        }
    }
}

// finalize code components for this es6-module
Object.freeze(TeqFw_Web_Back_Dto_Plugin_Desc_Excludes);
