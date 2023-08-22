/**
 * Web address DTO.
 *
 * Structure to represent address (URL).
 * General form: https://hostname.com/root/doore/space/route/to/resource
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Back_Dto_Address';

// MODULE'S CLASSES
export default class TeqFw_Web_Back_Dto_Address {
    /** @type {string} frontend entrance point ('admin' or 'pub') */
    door;
    /** @type {string} root folder */
    root;
    /** @type {string} route to the resource (static or service) */
    route;
    /** @type {string} HTTP handlers space ('api', 'src' or 'web') */
    space;
}

/**
 * Factory to create new DTO instances.
 * @memberOf TeqFw_Web_Back_Dto_Address
 */
export class Factory {
    static namespace = NS;

    /**
     * @param {TeqFw_Core_Shared_Util_Cast.castString|function} castString
     */
    constructor(
        {
            ['TeqFw_Core_Shared_Util_Cast.castString']: castString,
        }
    ) {
        /**
         * @param {TeqFw_Web_Back_Dto_Address|null} data
         * @return {TeqFw_Web_Back_Dto_Address}
         */
        this.create = function (data = null) {
            const res = new TeqFw_Web_Back_Dto_Address();
            res.door = castString(data?.door);
            res.root = castString(data?.root);
            res.route = castString(data?.route);
            res.space = castString(data?.space);
            return res;
        }
    }
}
