/**
 * Configuration DTO for 'server' node of web plugin section.
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Back_Api_Dto_Config_Local_Server';

// MODULE'S CLASSES
export default class TeqFw_Web_Back_Api_Dto_Config_Local_Server {
    /** @type {number} port to listening (3000) */
    port;
}

// noinspection JSCheckFunctionSignatures
/**
 * Factory to create new DTO instances.
 * @memberOf TeqFw_Web_Back_Api_Dto_Config_Local_Server
 */
export class Factory {
    constructor(spec) {
        const {castInt} = spec['TeqFw_Core_Shared_Util_Cast'];

        /**
         * @param {TeqFw_Web_Back_Api_Dto_Config_Local_Server|null} data
         * @return {TeqFw_Web_Back_Api_Dto_Config_Local_Server}
         */
        this.create = function (data = null) {
            const res = new TeqFw_Web_Back_Api_Dto_Config_Local_Server();
            res.port = castInt(data?.port);
            return res;
        }
    }
}

// finalize code components for this es6-module
Object.defineProperty(Factory, 'name', {value: `${NS}.${Factory.constructor.name}`});
