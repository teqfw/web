/**
 * DTO to describe excludes for web request handlers, WAPI services, etc.
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Back_Plugin_Dto_Desc_Excludes';

// MODULE'S CLASSES
/**
 * @memberOf TeqFw_Web_Back_Plugin_Dto_Desc_Excludes
 */
class Dto {
    static namespace = NS;
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

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto
 */
export default class TeqFw_Web_Back_Plugin_Dto_Desc_Excludes {
    /**
     * @param {TeqFw_Core_Shared_Util_Cast.castArrayOfStr|function} castArrayOfStr
     */

    constructor(
        {
            ['TeqFw_Core_Shared_Util_Cast.castArrayOfStr']: castArrayOfStr,
        }) {
        /**
         * @param {TeqFw_Web_Back_Plugin_Dto_Desc_Excludes.Dto} [data]
         * @return {TeqFw_Web_Back_Plugin_Dto_Desc_Excludes.Dto}
         */
        this.createDto = function (data) {
            // create new DTO
            const res = new Dto();
            // cast known attributes
            res.handlers = castArrayOfStr(data?.handlers);
            res.swCache = castArrayOfStr(data?.swCache);
            res.wapi = castArrayOfStr(data?.wapi);
            return res;
        }
    }
}