/**
 * Action to load DI configuration (namespaces & replacements).
 *
 * @namespace TeqFw_Web_Back_App_Server_Handler_Config_Di
 */
// MODULE'S IMPORT
import $path from "path";

// MODULE'S VARS
const NS = 'TeqFw_Web_Back_App_Server_Handler_Config_Di';

// MODULE'S FUNCS
/**
 * Default export is a factory to create result function in working environment (with deps).
 * @param {TeqFw_Di_Shared_SpecProxy} spec
 */
export default function (spec) {
    // DEPS
    /** @type {TeqFw_Web_Back_Defaults} */
    const DEF = spec['TeqFw_Web_Back_Defaults$'];
    /** @type {TeqFw_Core_Back_App_Init_Plugin_Registry} */
    const registry = spec['TeqFw_Core_Back_App_Init_Plugin_Registry$'];
    /** @type {TeqFw_Web_Shared_Dto_Config_Di} */
    const dtoDi = spec['TeqFw_Web_Shared_Dto_Config_Di$'];
    /** @type {TeqFw_Web_Shared_Dto_Config_Di_Namespace} */
    const dtoNs = spec['TeqFw_Web_Shared_Dto_Config_Di_Namespace$'];
    /** @type {TeqFw_Web_Shared_Dto_Config_Di_Replacement} */
    const dtoReplace = spec['TeqFw_Web_Shared_Dto_Config_Di_Replacement$'];

    // FUNCS

    /**
     * Loop through all plugins and compose namespace-to-source mapping for DI container on the front.
     * (@see TeqFw_Web_Back_App_Server_Handler_Static)
     *
     * @param {TeqFw_Core_Back_App_Init_Plugin_Registry} registry
     * @return {TeqFw_Web_Shared_Dto_Config_Di_Namespace.Dto[]}
     */
    function getNamespaces(registry) {
        const result = [];
        const plugins = registry.items();
        for (const one of plugins) {
            /** @type {TeqFw_Di_Back_Api_Dto_Plugin_Desc} */
            const desc = one.teqfw[DEF.MOD_DI.NAME];
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
     * @param {TeqFw_Core_Back_App_Init_Plugin_Registry} registry
     * @return {TeqFw_Web_Shared_Dto_Config_Di_Replacement.Dto[]}
     */
    function getReplaces(registry) {
        const result = [];
        const plugins = registry.items();
        const mapDiDesc = {}; // pluginName => {}
        plugins.map((a) => {mapDiDesc[a.name] = a.teqfw[DEF.MOD_DI.NAME]});
        const levels = registry.getLevels();
        const levelKeys = Object.keys(levels).map(key => parseInt(key)); // get keys as integers
        levelKeys.sort((a, b) => a - b); // sort as numbers
        // run through the levels from bottom to top and apply replaces
        const mapReplace = {};
        for (const key of levelKeys) {
            const level = levels[key];
            for (const name of level) {
                /** @type {TeqFw_Di_Back_Api_Dto_Plugin_Desc} */
                const desc = mapDiDesc[name];
                if (Array.isArray(Object.keys(desc?.replace)))
                    for (const orig of Object.keys(desc.replace)) {
                        const one = desc.replace[orig];
                        if (typeof one === 'string') {
                            mapReplace[orig] = one;
                        } else if (typeof one === 'object') {
                            if (typeof one[DEF.AREA] === 'string') {
                                mapReplace[orig] = one[DEF.AREA];
                            }
                        }
                    }
            }
        }
        // convert object to DTO
        for (const one of Object.keys(mapReplace)) {
            const item = dtoReplace.createDto();
            item.orig = one;
            item.alter = mapReplace[one];
            result.push(item);
        }

        return result;
    }

    /**
     * Result function.
     * @memberOf TeqFw_Web_Back_App_Server_Handler_Config_Di
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
