/**
 * Load list of files to be cached on the front by service worker.
 *
 * @namespace TeqFw_Web_Back_WAPI_Load_FilesToCache
 */
// MODULE'S IMPORT
import {join} from 'path';
import {existsSync} from 'fs';

// MODULE'S VARS
const NS = 'TeqFw_Web_Back_WAPI_Load_FilesToCache';

/**
 * @implements TeqFw_Web_Back_Api_WAPI_IFactory
 */
export default class TeqFw_Web_Back_WAPI_Load_FilesToCache {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Web_Back_Defaults} */
        const DEF = spec['TeqFw_Web_Back_Defaults$'];
        /** @type {Function|TeqFw_Core_Back_Util.scanRecursively} */
        const scanRecursively = spec['TeqFw_Core_Back_Util#scanRecursively'];
        /** @type {TeqFw_Core_Back_Scan_Plugin_Registry} */
        const registry = spec['TeqFw_Core_Back_Scan_Plugin_Registry$'];
        /** @type {TeqFw_Web_Shared_WAPI_Load_FilesToCache.Factory} */
        const route = spec['TeqFw_Web_Shared_WAPI_Load_FilesToCache#Factory$'];

        // DEFINE INSTANCE METHODS
        this.getRouteFactory = () => route;

        this.getService = function () {
            // DEFINE INNER FUNCTIONS
            /**
             *
             * @param {TeqFw_Web_Back_Server_Handler_WAPI_Context} context
             */
            async function service(context) {
                // DEFINE INNER FUNCTIONS
                /**
                 * Scan each teq-plugin of the app and compose URL for files
                 * from './Front/', './Shared/' and './web/' folders.
                 * @param {string} door entry point for app ('pub', 'admin')
                 * @return {string[]}
                 */
                function generateUrlsList(door) {
                    // DEFINE INNER FUNCTIONS
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
                        // scan './Front/'
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
                     * @param {string} door 'admin'
                     * @return {string[]}
                     */
                    function readAppWeb(path, door) {
                        const res = [];
                        if (existsSync(path)) {
                            const files = scanRecursively(path);
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

                    // MAIN FUNCTIONALITY
                    const res = [];
                    const appName = registry.getAppName();
                    const items = registry.items();
                    for (const item of items) {
                        /** @type {TeqFw_Di_Back_Api_Dto_Plugin_Desc} */
                        const desc = item.teqfw[DEF.MOD_DI.NAME];
                        const autoload = desc.autoload;
                        const src = autoload.isAbsolute ? autoload.path : join(item.path, autoload.path);
                        res.push(...readSrcFiles(src, item.name));

                        if (item.name === appName) {
                            // app root plugin
                            const web = join(item.path, DEF.FS_STATIC_ROOT, door);
                            res.push(...readAppWeb(web, door));
                        } else {
                            // regular plugin
                            const web = join(item.path, DEF.FS_STATIC_ROOT);
                            res.push(...readWebPlugin(web, item.name));
                        }
                    }
                    return res;
                }

                // MAIN FUNCTIONALITY
                /** @type {TeqFw_Web_Shared_WAPI_Load_FilesToCache.Request} */
                const input = context.getInData();
                /** @type {TeqFw_Web_Shared_WAPI_Load_FilesToCache.Response} */
                const out = context.getOutData();
                out.items = generateUrlsList(input.door);
            }

            // MAIN FUNCTIONALITY
            Object.defineProperty(service, 'name', {value: `${NS}.${service.name}`});
            return service;
        }
    }

}
