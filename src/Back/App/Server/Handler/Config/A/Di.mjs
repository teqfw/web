/**
 * Action to load DI configuration (namespaces & replacements).
 *
 * @namespace TeqFw_Web_Back_App_Server_Handler_Config_A_Di
 */
// MODULE'S IMPORT
import $path from 'path';

// MODULE'S VARS
const NS = 'TeqFw_Web_Back_App_Server_Handler_Config_A_Di';

// MODULE'S FUNCS
/**
 * Default export is a factory to create result function in working environment (with deps).
 * @param {TeqFw_Di_Shared_SpecProxy} spec
 */
/**
 * @param {TeqFw_Web_Back_Defaults} DEF
 * @param {TeqFw_Core_Back_Api_Plugin_Registry} registry
 * @param {TeqFw_Web_Shared_Dto_Config_Di} dtoDi
 * @param {TeqFw_Web_Shared_Dto_Config_Di_Namespace} dtoNs
 * @param {TeqFw_Web_Shared_Dto_Config_Di_Replacement} dtoReplace
 * @param {typeof TeqFw_Core_Shared_Enum_Sphere} SPHERE
 */
export default function (
    {
        TeqFw_Web_Back_Defaults$: DEF,
        TeqFw_Core_Back_Api_Plugin_Registry$: registry,
        TeqFw_Web_Shared_Dto_Config_Di$: dtoDi,
        TeqFw_Web_Shared_Dto_Config_Di_Namespace$: dtoNs,
        TeqFw_Web_Shared_Dto_Config_Di_Replacement$: dtoReplace,
        TeqFw_Core_Shared_Enum_Sphere$: SPHERE,
    }) {
    // FUNCS

    /**
     * Loop through all plugins and compose namespace-to-source mapping for DI container on the front.
     * (@see TeqFw_Web_Back_App_Server_Handler_Static)
     *
     * @param {TeqFw_Core_Back_Api_Plugin_Registry} registry
     * @return {TeqFw_Web_Shared_Dto_Config_Di_Namespace.Dto[]}
     */
    function getNamespaces(registry) {
        const result = [];
        const plugins = registry.items();
        for (const one of plugins) {
            /** @type {TeqFw_Di_Back_Api_Dto_Plugin_Desc} */
            const desc = one.teqfw[DEF.MOD_CORE.SHARED.NAME_DI];
            const item = dtoNs.createDto();
            item.ext = desc.autoload.ext;
            item.ns = desc.autoload.ns;
            item.path = $path.join('/', DEF.SHARED.SPACE_SRC, one.name);
            result.push(item);
        }
        return result;
    }

    /**
     * Loop through all plugins and compose replaces for DI container on the front.
     *
     * @param {TeqFw_Core_Back_Api_Plugin_Registry} registry
     * @return {TeqFw_Web_Shared_Dto_Config_Di_Replacement.Dto[]}
     */
    function getReplaces(registry) {
        const result = [];
        const plugins = registry.getItemsByLevels();
        // run through the levels from bottom to top and apply replaces
        for (const plugin of plugins) {
            /** @type {TeqFw_Core_Back_Plugin_Dto_Desc_Di.Dto} */
            const desc = plugin.teqfw[DEF.MOD_CORE.SHARED.NAME_DI];
            if (Array.isArray(desc?.replaces)) {
                for (const one of desc.replaces) {
                    if (
                        (one.sphere === SPHERE.FRONT) ||
                        (one.sphere === SPHERE.SHARED)
                    ) {
                        const dto = dtoReplace.createDto();
                        dto.orig = one.from;
                        dto.alter = one.to;
                        result.push(dto);
                    }
                }
            }
        }
        return result;
    }

    /**
     * Result function.
     * @memberOf TeqFw_Web_Back_App_Server_Handler_Config_A_Di
     * @return {TeqFw_Web_Shared_Dto_Config_Di.Dto}
     */
    function act() {
        const namespaces = getNamespaces(registry);
        const replacements = getReplaces(registry);
        return dtoDi.createDto({namespaces, replacements});
    }

    // MAIN
    Object.defineProperty(act, 'namespace', {value: NS});
    return act;
}
