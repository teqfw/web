/**
 * Action to load files to be cached on the front by service worker.
 *
 * @namespace TeqFw_Web_Back_App_Server_Handler_Config_A_SwCache
 */
// MODULE'S IMPORT
import {join} from 'path';
import {existsSync} from 'fs';

// MODULE'S VARS
const NS = 'TeqFw_Web_Back_App_Server_Handler_Config_A_SwCache';

// MODULE'S FUNCS
/**
 * Default export is a factory to create result function in working environment (with deps).
 * @param {TeqFw_Di_Shared_SpecProxy} spec
 */
/**
 * @param {TeqFw_Web_Back_Defaults} DEF
 * @param {TeqFw_Core_Back_Util.scanRecursively|function} scanRecursively
 * @param {TeqFw_Core_Back_Api_Plugin_Registry} registry
 */
export default function (
    {
        TeqFw_Web_Back_Defaults$: DEF,
        ['TeqFw_Core_Back_Util#scanRecursively']: scanRecursively,
        TeqFw_Core_Back_Api_Plugin_Registry$: registry,
    }) {
    // FUNCS

    /**
     * Result function.
     * @memberOf TeqFw_Web_Back_App_Server_Handler_Config_A_SwCache
     * @return {*[]}
     */
    function act() {
        // FUNCS
        /**
         * Scan sources root recursively for files to cache and replace filesystem parts with URL parts.
         * @param {string} root path to the root folder of sources
         * @param {string} pluginName '@vnd/plugin'
         * @return {string[]}
         */
        function readSrcFiles(root, pluginName) {
            const res = [];
            const MOD_CORE = DEF.SHARED.MOD_CORE;
            const SPACE_SRC = DEF.SHARED.SPACE_SRC;
            // scan './Auth/'
            const pathFront = join(root, MOD_CORE.DIR_SRC_FRONT);
            if (existsSync(pathFront)) {
                const files = scanRecursively(pathFront);
                const urls = files.map(entry => entry.replace(root, `./${SPACE_SRC}/${pluginName}`));
                res.push(...urls);
            }
            // scan './Shared/'
            const pathShared = join(root, MOD_CORE.DIR_SRC_SHARED);
            if (existsSync(pathShared)) {
                const files = scanRecursively(pathShared);
                const urls = files.map(entry => entry.replace(root, `./${SPACE_SRC}/${pluginName}`));
                res.push(...urls);
            }
            return res;
        }

        /**
         * Scan app web root recursively and replace filesystem parts with URL parts.
         * @param {string} path path to the root folder of web resources
         * @param {string[]} excl paths to exclude from scan
         * @return {string[]}
         */
        function readAppWeb(path, excl) {
            const res = [];
            if (existsSync(path)) {
                // scan all files
                let files = scanRecursively(path);
                // exclude some files from results
                for (const one of excl) {
                    const full = join(path, one);
                    files = files.filter((entry) => entry.indexOf(full) !== 0);
                }
                // convert paths to URLs
                const urls = files.map(entry => entry.replace(path, '.'));
                res.push(...urls);
                res.push('.'); // add root default URL
            }
            return res;
        }

        /**
         * Scan plugin web root recursively and replace filesystem parts with URL parts.
         * @param {string} path path to the root folder of web resources
         * @param {string} pluginName '@vnd/plugin'
         * @return {string[]}
         */
        function readWebPlugin(path, pluginName) {
            const res = [];
            const SPACE_WEB = DEF.SHARED.SPACE_WEB;
            if (existsSync(path)) {
                const files = scanRecursively(path);
                const urls = files.map(entry => entry.replace(path, `./${SPACE_WEB}/${pluginName}`));
                res.push(...urls);
            }
            return res;
        }

        // MAIN
        const res = [];
        const appName = registry.getAppName();
        const items = registry.items();
        for (const item of items) {
            /** @type {TeqFw_Di_Back_Api_Dto_Plugin_Desc} */
            const desc = item.teqfw[DEF.MOD_CORE.SHARED.NAME_DI];
            const autoload = desc.autoload;
            const src = autoload.isAbsolute ? autoload.path : join(item.path, autoload.path);
            res.push(...readSrcFiles(src, item.name));

            if (item.name === appName) {
                // app root plugin
                /** @type {TeqFw_Web_Back_Plugin_Dto_Desc.Dto} */
                const desc = item.teqfw[DEF.SHARED.NAME];
                const doors = desc?.doors;
                if (Array.isArray(doors)) {
                    // TODO: process with 'doors'
                    for (const door of doors) {
                        // scan FS for every 'door'
                        // const web = join(item.path, DEF.FS_STATIC_ROOT, door);
                        // res.push(...readAppWeb(web, door));
                    }
                } else {
                    const excl = desc?.excludes?.swCache ?? [];
                    const web = join(item.path, DEF.FS_STATIC_ROOT);
                    res.push(...readAppWeb(web, excl));
                }

            } else {
                // regular plugin
                const web = join(item.path, DEF.FS_STATIC_ROOT);
                res.push(...readWebPlugin(web, item.name));
            }
        }
        return res;
    }

    // MAIN
    Object.defineProperty(act, 'namespace', {value: NS});
    return act;
}
