/**
 * Local configuration DTO for the plugin.
 * @see TeqFw_Core_Back_Config
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Back_Plugin_Dto_Config_Local';

// MODULE'S CLASSES
/**
 * @memberOf TeqFw_Web_Back_Plugin_Dto_Config_Local
 */
class Dto {
    static namespace = NS;
    /**
     * Any custom object to use as application configuration on the front.
     * @type {Object}
     */
    custom;
    /** @type {boolean} */
    frontLogsMonitoring;
    /** @type {TeqFw_Web_Back_Plugin_Dto_Config_Local_Server} */
    server;
    /** @type {string} base for URL constructing */
    urlBase;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto
 */
export default class TeqFw_Web_Back_Plugin_Dto_Config_Local {
    /**
     * @param {TeqFw_Core_Shared_Util_Cast.castBoolean|function} castBoolean
     * @param {TeqFw_Core_Shared_Util_Cast.castString|function} castString
     * @param {TeqFw_Web_Back_Plugin_Dto_Config_Local_Server.Factory} fServer
     */
    constructor(
        {
            'TeqFw_Core_Shared_Util_Cast.castBoolean': castBoolean,
            'TeqFw_Core_Shared_Util_Cast.castString': castString,
            'TeqFw_Web_Back_Plugin_Dto_Config_Local_Server.Factory$': fServer,
        }) {

        /**
         * @param {TeqFw_Web_Back_Plugin_Dto_Config_Local.Dto} data
         * @return {TeqFw_Web_Back_Plugin_Dto_Config_Local.Dto}
         */
        this.createDto = function (data) {
            // create new DTO and populate it with initialization data
            const res = Object.assign(new Dto(), data);
            // cast known attributes
            res.custom = structuredClone(data?.custom);
            res.frontLogsMonitoring = castBoolean(data?.frontLogsMonitoring);
            res.server = fServer.create(data?.server);
            res.urlBase = castString(data?.urlBase);
            return res;
        }
    }
}