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
     * The UUID for the current instance of the backend app (see `TeqFw_Core_Back_Mod_App_Uuid`).
     * @type {string}
     */
    backendUuid;
    /**
     * Any custom object to use as application configuration on the front.
     * @type {Object}
     */
    custom;
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
     * Root for teq-application (empty by default) is configured on the server side (./cfg/local.json).
     * @type {string}
     */
    root;
    /**
     * Base URL for frontend ('site.domain.com') is configured on the server side (./cfg/local.json).
     * @type {string}
     */
    urlBase;
    /**
     * The version for the app (@see `package.json`).
     * @type {string}
     */
    version;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto
 */
export default class TeqFw_Web_Shared_Dto_Config_Front {
    /**
     * @param {TeqFw_Core_Shared_Util_Cast.castBoolean|function} castBoolean
     * @param {TeqFw_Core_Shared_Util_Cast.castString|function} castString
     */
    constructor(
        {
            ['TeqFw_Core_Shared_Util_Cast.castBoolean']: castBoolean,
            ['TeqFw_Core_Shared_Util_Cast.castString']: castString,
        }
    ) {
        /**
         * @param {TeqFw_Web_Shared_Dto_Config_Front.Dto} [data]
         * @return {TeqFw_Web_Shared_Dto_Config_Front.Dto}
         */
        this.createDto = function (data) {
            const res = new Dto();
            res.backendUuid = castString(data?.backendUuid);
            res.custom = data?.custom;
            res.devMode = castBoolean(data?.devMode);
            res.door = castString(data?.door);
            res.root = castString(data?.root);
            res.urlBase = castString(data?.urlBase);
            res.version = castString(data?.version);
            return res;
        }
    }
}
