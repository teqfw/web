/**
 * Configuration DTO for web plugin.
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Back_Api_Dto_Config';

// MODULE'S CLASSES
export default class TeqFw_Web_Back_Api_Dto_Config {
    /** @type {TeqFw_Web_Back_Api_Dto_Config_Server} */
    server;
    /** @type {string} base for URL constructing */
    urlBase;
}

/**
 * Factory to create new DTO instances.
 * @memberOf TeqFw_Web_Back_Api_Dto_Config
 */
export class Factory {
    constructor(spec) {
        /** @type {typeof TeqFw_Web_Back_Api_Dto_Config_Server} */
        const DServer = spec['TeqFw_Web_Back_Api_Dto_Config_Server#'];
        /** @type {TeqFw_Web_Back_Api_Dto_Config_Server.Factory} */
        const fServer = spec['TeqFw_Web_Back_Api_Dto_Config_Server#Factory$'];
        /**
         * @param {TeqFw_Web_Back_Api_Dto_Config|null} data
         * @return {TeqFw_Web_Back_Api_Dto_Config}
         */
        this.create = function (data = null) {
            const res = new TeqFw_Web_Back_Api_Dto_Config();
            res.server = (data?.server instanceof DServer) ? data.server : fServer.create(data?.server);
            res.urlBase = data?.urlBase;
            return res;
        }
    }
}

// freeze class to deny attributes changes then export class
Object.freeze(TeqFw_Web_Back_Api_Dto_Config);
Object.defineProperty(Factory, 'name', {value: `${NS}.${Factory.constructor.name}`});
