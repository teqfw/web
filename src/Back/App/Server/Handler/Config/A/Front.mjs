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
 *
 * @param {TeqFw_Web_Back_Defaults} DEF
 * @param {TeqFw_Core_Back_Config} config
 * @param {TeqFw_Core_Back_Mod_App_Uuid} modAppUuid
 * @param {TeqFw_Web_Shared_Dto_Config_Front} dtoFront
 */
export default function (
    {
        TeqFw_Web_Back_Defaults$: DEF,
        TeqFw_Core_Back_Config$: config,
        TeqFw_Core_Back_Mod_App_Uuid$: modAppUuid,
        TeqFw_Web_Shared_Dto_Config_Front$: dtoFront,
    }
) {
    // FUNCS

    /**
     * Result function.
     * @memberOf TeqFw_Web_Back_App_Server_Handler_Config_A_Front
     * @returns {TeqFw_Web_Shared_Dto_Config_Front.Dto}
     */
    function act() {
        /** @type {TeqFw_Web_Back_Plugin_Dto_Config_Local.Dto} */
        const cfgWeb = config.getLocal(DEF.SHARED.NAME);
        /** @type {TeqFw_Core_Back_Plugin_Dto_Config_Local.Dto} */
        const cfgCore = config.getLocal(DEF.MOD_CORE.SHARED.NAME);

        /** @type {TeqFw_Web_Shared_Dto_Config_Front.Dto} */
        const res = dtoFront.createDto();
        if (cfgWeb?.custom) res.custom = cfgWeb.custom;
        if (cfgWeb?.urlBase) res.urlBase = cfgWeb.urlBase;
        if (cfgCore?.devMode) res.devMode = cfgCore.devMode;
        res.backendUuid = modAppUuid.get(); // use backend application UUID
        res.version = config.getVersion();
        return res;
    }

    // MAIN
    Object.defineProperty(act, 'namespace', {value: NS});
    return act;
}
