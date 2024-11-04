/**
 * Namespace item DTO for DI container configuration.
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Shared_Dto_Config_Di_Namespace';

// MODULE'S CLASSES
/**
 * @memberOf TeqFw_Web_Shared_Dto_Config_Di_Namespace
 */
class Dto {
    static namespace = NS;
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

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto
 */
export default class TeqFw_Web_Shared_Dto_Config_Di_Namespace {
    /**
     * @param {TeqFw_Core_Shared_Util_Cast.castString|function} castString
     */

    constructor(
        {
            'TeqFw_Core_Shared_Util_Cast.castString': castString,
        }) {
        /**
         * @param {TeqFw_Web_Shared_Dto_Config_Di_Namespace.Dto} [data]
         * @returns {TeqFw_Web_Shared_Dto_Config_Di_Namespace.Dto}
         */
        this.createDto = function (data) {
            const res = new Dto();
            res.ext = castString(data?.ext);
            res.ns = castString(data?.ns);
            res.path = castString(data?.path);
            return res;
        }
    }
}
