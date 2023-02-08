/**
 * Action to load front app configuration.
 *
 * @namespace TeqFw_Web_Back_App_Server_Handler_Config_A_Front
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Back_App_Server_Handler_Config_A_Front';

// MODULE'S FUNCS
/**
 * Default export is a factory to create result function in working environment (with deps).
 * @param {TeqFw_Di_Shared_SpecProxy} spec
 */
export default function (spec) {
    // DEPS
    /** @type {TeqFw_Web_Back_Defaults} */
    const DEF = spec['TeqFw_Web_Back_Defaults$'];
    /** @type {TeqFw_Core_Back_Config} */
    const config = spec['TeqFw_Core_Back_Config$'];
    /** @type {TeqFw_Web_Shared_Dto_Config_Front} */
    const factDto = spec['TeqFw_Web_Shared_Dto_Config_Front$'];

    // FUNCS

    /**
     * Result function.
     * @memberOf TeqFw_Web_Back_App_Server_Handler_Config_A_Front
     * @return {TeqFw_Web_Shared_Dto_Config_Front.Dto}
     */
    function act() {
        /** @type {TeqFw_Web_Back_Dto_Config_Local} */
        const webCfg = config.getLocal(DEF.SHARED.NAME);
        /** @type {TeqFw_Core_Back_Plugin_Dto_Config_Local} */
        const webCore = config.getLocal(DEF.MOD_CORE.SHARED.NAME);

        /** @type {TeqFw_Web_Shared_Dto_Config_Front.Dto} */
        const res = factDto.createDto();
        if (webCfg?.custom) res.custom = webCfg.custom;
        if (webCfg?.frontLogsMonitoring) res.frontLogsMonitoring = webCfg.frontLogsMonitoring; // 'true' only
        if (webCfg?.urlBase) res.urlBase = webCfg.urlBase;
        if (webCore?.devMode) res.devMode = webCore.devMode;
        return res;
    }

    // MAIN
    Object.defineProperty(act, 'namespace', {value: NS});
    return act;
}
