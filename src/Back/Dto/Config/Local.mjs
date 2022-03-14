/**
 * Local configuration DTO for the plugin.
 * @see TeqFw_Core_Back_Config
 */
import {castBoolean} from "@teqfw/core/src/Shared/Util/Cast.mjs";

// MODULE'S VARS
const NS = 'TeqFw_Web_Back_Dto_Config_Local';

// MODULE'S CLASSES
export default class TeqFw_Web_Back_Dto_Config_Local {
    /** @type {boolean} */
    frontLogsMonitoring;
    /** @type {TeqFw_Web_Back_Dto_Config_Local_Server} */
    server;
    /** @type {string} base for URL constructing */
    urlBase;
}

/**
 * Factory to create new DTO instances.
 * @memberOf TeqFw_Web_Back_Dto_Config_Local
 */
export class Factory {
    static namespace = NS;

    constructor(spec) {
        /** @type {TeqFw_Core_Shared_Util_Cast.castBoolean|function} */
        const castBoolean = spec['TeqFw_Core_Shared_Util_Cast.castBoolean'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];

        /** @type {TeqFw_Web_Back_Dto_Config_Local_Server.Factory} */
        const fServer = spec['TeqFw_Web_Back_Dto_Config_Local_Server#Factory$'];
        /**
         * @param {TeqFw_Web_Back_Dto_Config_Local|null} data
         * @return {TeqFw_Web_Back_Dto_Config_Local}
         */
        this.create = function (data = null) {
            const res = new TeqFw_Web_Back_Dto_Config_Local();
            res.frontLogsMonitoring = castBoolean(data?.frontLogsMonitoring);
            res.server = fServer.create(data?.server);
            res.urlBase = castString(data?.urlBase);
            return res;
        }
    }
}
