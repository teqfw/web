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
        /** @type {TeqFw_Web_Back_Plugin_Dto_Config_Local.Dto} */
        const cfgWeb = config.getLocal(DEF.SHARED.NAME);
        /** @type {TeqFw_Core_Back_Plugin_Dto_Config_Local.Dto} */
        const cfgCore = config.getLocal(DEF.MOD_CORE.SHARED.NAME);

        /** @type {TeqFw_Web_Shared_Dto_Config_Front.Dto} */
        const res = factDto.createDto();
        if (cfgWeb?.custom) res.custom = cfgWeb.custom;
        if (cfgWeb?.frontLogsMonitoring) res.frontLogsMonitoring = cfgWeb.frontLogsMonitoring; // 'true' only
        if (cfgWeb?.urlBase) res.urlBase = cfgWeb.urlBase;
        if (cfgCore?.devMode) res.devMode = cfgCore.devMode;
        return res;
    }

    // MAIN
    Object.defineProperty(act, 'namespace', {value: NS});
    return act;
}
