/**
 * Load list of files to be cached on the front by service worker.
 *
 * @namespace TeqFw_Web_Back_Service_Load_FilesToCache
 */
// MODULE'S IMPORT
import {join} from 'path';
import {existsSync} from 'fs';

// MODULE'S VARS
const NS = 'TeqFw_Web_Back_Service_Load_FilesToCache';

/**
 * @implements TeqFw_Web_Back_Api_Service_IFactory
 */
export default class TeqFw_Web_Back_Service_Load_FilesToCache {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Web_Back_Defaults} */
        const DEF = spec['TeqFw_Web_Back_Defaults$'];
        /** @type {Function|TeqFw_Core_Back_Util.scanRecursively} */
        const scanRecursively = spec['TeqFw_Core_Back_Util#scanRecursively'];
        /** @type {TeqFw_Core_Back_Scan_Plugin_Registry} */
        const registry = spec['TeqFw_Core_Back_Scan_Plugin_Registry$'];
        /** @type {TeqFw_Web_Shared_Service_Route_Load_FilesToCache.Factory} */
        const route = spec['TeqFw_Web_Shared_Service_Route_Load_FilesToCache#Factory$'];

        // DEFINE INSTANCE METHODS
        this.getRouteFactory = () => route;

        this.getService = function () {
            // DEFINE INNER FUNCTIONS
            /**
             *
             * @param {TeqFw_Web_Back_Api_Service_Context} context
             */
            async function service(context) {
                // DEFINE INNER FUNCTIONS
                /**
                 * Scan each teq-plugin of the app and compose URL for files
                 * from './Front/', './Shared/' and './web/' folders.
                 * @return {string[]}
                 */
                function generateUrlsList() {
                    // DEFINE INNER FUNCTIONS
                    /**
                     * Scan root folder recursively and replace filesystem parts with URL parts.
                     * @param {string} path path to the root folder
                     * @param {string} space 'src' or 'web'
                     * @param {string} pluginName '@vnd/plugin'
                     * @return {string[]}
                     */
                    function readFiles(path, space, pluginName) {
                        const res = [];
                        if (existsSync(path)) {
                            const files = scanRecursively(path);
                            const urls = files.map(entry => entry.replace(path, `./${space}/${pluginName}`));
                            res.push(...urls);
                        }
                        return res;
                    }

                    // MAIN FUNCTIONALITY
                    const res = [];
                    const items = registry.items();
                    for (const item of items) {
                        /** @type {TeqFw_Di_Back_Api_Dto_Plugin_Desc} */
                        const desc = item.teqfw[DEF.MOD_DI.NAME];
                        const autoload = desc.autoload;
                        const src = autoload.isAbsolute ? autoload.path : join(item.path, autoload.path);
                        const srcFront = join(src, DEF.SHARED.MOD_CORE.DIR_SRC_FRONT);
                        res.push(...readFiles(srcFront, DEF.SHARED.SPACE_SRC, item.name));
                        const srcShared = join(src, DEF.SHARED.MOD_CORE.DIR_SRC_SHARED);
                        res.push(...readFiles(srcShared, DEF.SHARED.SPACE_SRC, item.name));
                        const web = join(item.path, DEF.FS_STATIC_ROOT);
                        res.push(...readFiles(web, DEF.SHARED.SPACE_WEB, item.name));
                    }
                    return res;
                }

                // MAIN FUNCTIONALITY
                /** @type {TeqFw_Web_Shared_Service_Route_Load_FilesToCache.Response} */
                const out = context.getOutData();
                out.items = generateUrlsList();
            }

            // MAIN FUNCTIONALITY
            Object.defineProperty(service, 'name', {value: `${NS}.${service.name}`});
            return service;
        }
    }

}
