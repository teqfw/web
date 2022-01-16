/**
 * Local configuration DTO for the plugin.
 * @see TeqFw_Core_Back_Config
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Back_Dto_Config_Local';

// MODULE'S CLASSES
export default class TeqFw_Web_Back_Dto_Config_Local {
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
        const {castString} = spec['TeqFw_Core_Shared_Util_Cast'];

        /** @type {TeqFw_Web_Back_Dto_Config_Local_Server.Factory} */
        const fServer = spec['TeqFw_Web_Back_Dto_Config_Local_Server#Factory$'];
        /**
         * @param {TeqFw_Web_Back_Dto_Config_Local|null} data
         * @return {TeqFw_Web_Back_Dto_Config_Local}
         */
        this.create = function (data = null) {
            const res = new TeqFw_Web_Back_Dto_Config_Local();
            res.server = fServer.create(data?.server);
            res.urlBase = castString(data?.urlBase);
            return res;
        }
    }
}
