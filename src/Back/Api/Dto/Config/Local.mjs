/**
 * Local configuration DTO for the plugin.
 * @see TeqFw_Core_Back_Config
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Back_Api_Dto_Config_Local';

// MODULE'S CLASSES
export default class TeqFw_Web_Back_Api_Dto_Config_Local {
    /** @type {TeqFw_Web_Back_Api_Dto_Config_Local_Server} */
    server;
    /** @type {string} base for URL constructing */
    urlBase;
}

/**
 * Factory to create new DTO instances.
 * @memberOf TeqFw_Web_Back_Api_Dto_Config_Local
 */
export class Factory {
    constructor(spec) {
        /** @type {typeof TeqFw_Web_Back_Api_Dto_Config_Local_Server} */
        const DServer = spec['TeqFw_Web_Back_Api_Dto_Config_Local_Server#'];
        /** @type {TeqFw_Web_Back_Api_Dto_Config_Local_Server.Factory} */
        const fServer = spec['TeqFw_Web_Back_Api_Dto_Config_Local_Server#Factory$'];
        /**
         * @param {TeqFw_Web_Back_Api_Dto_Config_Local|null} data
         * @return {TeqFw_Web_Back_Api_Dto_Config_Local}
         */
        this.create = function (data = null) {
            const res = new TeqFw_Web_Back_Api_Dto_Config_Local();
            res.server = (data?.server instanceof DServer) ? data.server : fServer.create(data?.server);
            res.urlBase = data?.urlBase;
            return res;
        }
    }
}

// finalize code components for this es6-module
Object.defineProperty(Factory, 'name', {value: `${NS}.${Factory.constructor.name}`});
