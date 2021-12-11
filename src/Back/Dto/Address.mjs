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
    constructor(spec) {
        const {castString} = spec['TeqFw_Core_Shared_Util_Cast'];

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

// finalize code components for this es6-module
Object.defineProperty(Factory, 'name', {value: `${NS}.${Factory.constructor.name}`});