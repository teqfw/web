/**
 * Logging transport implementation for front app.
 * Send logs to backend's logs collector.
 *
 * @implements TeqFw_Core_Shared_Api_Logger_ITransport
 */
export default class TeqFw_Web_Front_Mod_Logger_Transport {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Web_Front_Defaults} */
        const DEF = spec['TeqFw_Web_Front_Defaults$'];
        /** @type {TeqFw_Core_Shared_Mod_Logger_Transport_Console} */
        const transConsole = spec['TeqFw_Core_Shared_Mod_Logger_Transport_Console$'];
        /** @type {TeqFw_Web_Api_Front_Mod_Connect} */
        const wapi = spec['TeqFw_Web_Api_Front_Mod_Connect$'];
        /** @type {TeqFw_Web_Api_Shared_WAPI_Front_Log_Collect} */
        const wapiLogCollect = spec['TeqFw_Web_Api_Shared_WAPI_Front_Log_Collect$'];
        /** @type {TeqFw_Web_Auth_Front_Mod_Identity_Front} */
        const identityFront = spec['TeqFw_Web_Auth_Front_Mod_Identity_Front$'];
        /** @type {TeqFw_Web_Auth_Front_Mod_Identity_Back} */
        const identityBack = spec['TeqFw_Web_Auth_Front_Mod_Identity_Back$'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castBooleanIfExists|function} */
        const castBooleanIfExists = spec['TeqFw_Core_Shared_Util_Cast.castBooleanIfExists'];
        /** @type {TeqFw_Web_Front_Mod_Config} */
        const modCfg = spec['TeqFw_Web_Front_Mod_Config$'];

        // VARS
        const STORE_KEY = `${DEF.SHARED.NAME}/front/log/monitor`;
        let _canSendLogs;

        // INSTANCE METHODS
        this.log = function (dto) {
            const cfg = modCfg.get();
            if (cfg.frontLogsMonitoring && _canSendLogs && navigator.onLine) {
                const req = wapiLogCollect.createReq();
                req.item = dto;
                dto.meta = dto?.meta || {};
                dto.meta.frontUuid = dto.meta?.frontUuid || identityFront.getUuid();
                dto.meta.backUuid = dto.meta?.backUuid || identityBack.getUUID();
                // noinspection JSIgnoredPromiseFromCall
                wapi.send(req, wapiLogCollect)
                    .then((data) => {
                        if (data === false) _canSendLogs = false;
                    })
                    .catch(() => _canSendLogs = false);
            }
            // duplicate to console
            transConsole.log(dto);
        }

        this.enableLogs = function () {
            _canSendLogs = true;
            window.localStorage.setItem(STORE_KEY, _canSendLogs);
        }

        this.disableLogs = function () {
            _canSendLogs = false;
            window.localStorage.setItem(STORE_KEY, _canSendLogs);
        }

        this.isLogsMonitorOn = () => _canSendLogs;

        this.initFromLocalStorage = function () {
            const cfg = modCfg.get();
            const stored = window.localStorage.getItem(STORE_KEY);
            _canSendLogs = castBooleanIfExists(stored) ?? cfg.frontLogsMonitoring;
        }
    }
}
