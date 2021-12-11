/**
 * Configuration DTO for 'server' node of web plugin section.
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Back_Dto_Config_Local_Server';

// MODULE'S CLASSES
export default class TeqFw_Web_Back_Dto_Config_Local_Server {
    /**
     * Port to listening (3000).
     * @type {number}
     */
    port;
    /**
     * Secure server configuration.
     * @type {TeqFw_Web_Back_Dto_Config_Local_Server_Secure}
     */
    secure;
    /**
     * 'true' - use HTTP/1 server. Option is ignored if 'secure' node is set.
     * @type {boolean}
     */
    useHttp1;
}

// noinspection JSCheckFunctionSignatures
/**
 * Factory to create new DTO instances.
 * @memberOf TeqFw_Web_Back_Dto_Config_Local_Server
 */
export class Factory {
    constructor(spec) {
        const {castInt, castBoolean} = spec['TeqFw_Core_Shared_Util_Cast'];
        /** @type {TeqFw_Web_Back_Dto_Config_Local_Server_Secure.Factory} */
        const fSecure = spec['TeqFw_Web_Back_Dto_Config_Local_Server_Secure.Factory$'];

        /**
         * @param {TeqFw_Web_Back_Dto_Config_Local_Server|null} data
         * @return {TeqFw_Web_Back_Dto_Config_Local_Server}
         */
        this.create = function (data = null) {
            const res = new TeqFw_Web_Back_Dto_Config_Local_Server();
            res.port = castInt(data?.port);
            res.secure = fSecure.create(data?.secure);
            res.useHttp1 = castBoolean(data?.useHttp1);
            return res;
        }
    }
}

// finalize code components for this es6-module
Object.defineProperty(Factory, 'name', {value: `${NS}.${Factory.constructor.name}`});
