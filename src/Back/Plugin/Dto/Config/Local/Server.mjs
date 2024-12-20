/**
 * Configuration DTO for 'server' node of web plugin section.
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Back_Plugin_Dto_Config_Local_Server';

// MODULE'S CLASSES
export default class TeqFw_Web_Back_Plugin_Dto_Config_Local_Server {
    /**
     * Port to listening (3000).
     * @type {number}
     */
    port;
    /**
     * Secure server configuration.
     * @type {TeqFw_Web_Back_Plugin_Dto_Config_Local_Server_Secure}
     */
    secure;
    /**
     * 'true' - use HTTP/1 server. Option is ignored if 'secure' node is set.
     * @type {boolean}
     */
    useHttp1;
    /**
     * 'true' - use WebSocket (skipped by default).
     * @type {boolean}
     */
    useWebSocket;
}

// noinspection JSCheckFunctionSignatures
/**
 * Factory to create new DTO instances.
 * @memberOf TeqFw_Web_Back_Plugin_Dto_Config_Local_Server
 */
export class Factory {
    static namespace = NS;

    /**
     * @param {TeqFw_Core_Shared_Util_Cast.castBoolean|function} castBoolean
     * @param {TeqFw_Core_Shared_Util_Cast.castInt|function} castInt
     * @param {TeqFw_Web_Back_Plugin_Dto_Config_Local_Server_Secure.Factory} fSecure
     */

    constructor(
        {
            'TeqFw_Core_Shared_Util_Cast.castBoolean': castBoolean,
            'TeqFw_Core_Shared_Util_Cast.castInt': castInt,
            'TeqFw_Web_Back_Plugin_Dto_Config_Local_Server_Secure.Factory$': fSecure,
        }) {
        /**
         * @param {TeqFw_Web_Back_Plugin_Dto_Config_Local_Server|null} data
         * @returns {TeqFw_Web_Back_Plugin_Dto_Config_Local_Server}
         */
        this.create = function (data = null) {
            const res = new TeqFw_Web_Back_Plugin_Dto_Config_Local_Server();
            res.port = castInt(data?.port);
            res.secure = fSecure.create(data?.secure);
            res.useHttp1 = castBoolean(data?.useHttp1);
            res.useWebSocket = castBoolean(data?.useWebSocket);
            return res;
        };
    }
}
