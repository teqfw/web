/**
 * Replacement item DTO for DI container configuration.
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Shared_Dto_Config_Di_Replacement';

// MODULE'S CLASSES
/**
 * @memberOf TeqFw_Web_Shared_Dto_Config_Di_Replacement
 */
class Dto {
    static namespace = NS;
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

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto
 */
export default class TeqFw_Web_Shared_Dto_Config_Di_Replacement {
    /**
     * @param {TeqFw_Core_Shared_Util_Cast.castString|function} castString
     */

    constructor(
        {
            'TeqFw_Core_Shared_Util_Cast.castString': castString,
        }) {
        /**
         * @param {TeqFw_Web_Shared_Dto_Config_Di_Replacement.Dto} [data]
         * @returns {TeqFw_Web_Shared_Dto_Config_Di_Replacement.Dto}
         */
        this.createDto = function (data) {
            const res = new Dto();
            res.alter = castString(data?.alter);
            res.orig = castString(data?.orig);
            return res;
        };
    }
}
