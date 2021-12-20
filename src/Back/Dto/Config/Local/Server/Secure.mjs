/**
 * DTO for secure server configuration.
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Back_Dto_Config_Local_Server_Secure';

// MODULE'S CLASSES
export default class TeqFw_Web_Back_Dto_Config_Local_Server_Secure {
    /**
     * Path to certificates chain in PEM format (absolute or relative to app's root folder).
     * @type {string}
     */
    cert;
    /**
     * Path to server's private key in PEM format (absolute or relative to app's root folder).
     * @type {string}
     */
    key;
}

// noinspection JSCheckFunctionSignatures
/**
 * Factory to create new DTO instances.
 * @memberOf TeqFw_Web_Back_Dto_Config_Local_Server_Secure
 */
export class Factory {
    constructor(spec) {
        const {castString} = spec['TeqFw_Core_Shared_Util_Cast'];

        /**
         * @param {TeqFw_Web_Back_Dto_Config_Local_Server_Secure|null} data
         * @return {TeqFw_Web_Back_Dto_Config_Local_Server_Secure}
         */
        this.create = function (data = null) {
            const res = new TeqFw_Web_Back_Dto_Config_Local_Server_Secure();
            res.cert = castString(data?.cert);
            res.key = castString(data?.key);
            return res;
        }
    }
}

// finalize code components for this es6-module
Object.defineProperty(Factory, 'name', {value: `${NS}.${Factory.constructor.name}`});
