/**
 * Logging transport implementation for front app.
 * Send logs to backend's logs collector.
 *
 * @namespace TeqFw_Web_Front_Mod_Logger_Transport
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Front_Mod_Logger_Transport';

// MODULE'S CLASSES
/**
 * @implements TeqFw_Core_Shared_Api_Logger_ITransport
 */
export default class TeqFw_Web_Front_Mod_Logger_Transport {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Mod_Logger_Transport_Console} */
        const transConsole = spec['TeqFw_Core_Shared_Mod_Logger_Transport_Console$'];
        /** @type {TeqFw_Web_Front_App_Connect_WAPI} */
        const wapi = spec['TeqFw_Web_Front_App_Connect_WAPI$'];
        /** @type {TeqFw_Web_Shared_WAPI_Front_Log_Collect.Factory} */
        const wapiLogCollect = spec['TeqFw_Web_Shared_WAPI_Front_Log_Collect.Factory$'];
        /** @type {TeqFw_Web_Front_Mod_App_Front_Identity} */
        const identityFront = spec['TeqFw_Web_Front_Mod_App_Front_Identity$'];
        /** @type {TeqFw_Web_Front_Mod_App_Back_Identity} */
        const identityBack = spec['TeqFw_Web_Front_Mod_App_Back_Identity$'];

        // VARS
        let canSendLogs = true;

        // INSTANCE METHODS
        this.log = function (dto) {
            if (canSendLogs) {
                const req = wapiLogCollect.createReq();
                req.item = dto;
                dto.meta = dto?.meta || {};
                dto.meta.frontUuid = dto.meta?.frontUuid || identityFront.getUuid();
                dto.meta.backUuid = dto.meta?.backUuid || identityBack.getUUID();
                // noinspection JSIgnoredPromiseFromCall
                wapi.send(req, wapiLogCollect)
                    .then((data) => {
                        if (data === false) canSendLogs = !false; // TODO: configure transport from the front
                    })
                    .catch((e) => canSendLogs = !false); // TODO: configure transport from the front
            }
            // duplicate to console
            transConsole.log(dto);
        }
    }
}
