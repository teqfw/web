/**
 * Frontend configuration DTO.
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Shared_Dto_Config_Front';

// MODULE'S CLASSES
/**
 * @memberOf TeqFw_Web_Shared_Dto_Config_Front
 */
class Dto {
    static namespace = NS;
    /**
     * 'true' - application is in development mode.
     * @type {Boolean}
     */
    devMode;
    /**
     * Current frontend door (pub, admin, ...) is configured on frontend (index.html).
     * @type {string}
     */
    door;
    /**
     * @type {boolean}
     */
    frontLogsMonitoring;
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
 * @implements TeqFw_Core_Shared_Api_Factory_IDto
 */
export default class TeqFw_Web_Shared_Dto_Config_Front {
    constructor(spec) {
        /** @type {TeqFw_Core_Shared_Util_Cast.castBoolean|function} */
        const castBoolean = spec['TeqFw_Core_Shared_Util_Cast.castBoolean'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];

        /**
         * @param {TeqFw_Web_Shared_Dto_Config_Front.Dto} [data]
         * @return {TeqFw_Web_Shared_Dto_Config_Front.Dto}
         */
        this.createDto = function (data) {
            const res = new Dto();
            res.devMode = castBoolean(data?.devMode);
            res.door = castString(data?.door);
            res.frontLogsMonitoring = castBoolean(data?.frontLogsMonitoring);
            res.root = castString(data?.root);
            res.urlBase = castString(data?.urlBase);
            return res;
        }
    }
}
