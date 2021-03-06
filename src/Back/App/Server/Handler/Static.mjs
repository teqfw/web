/**
 * Web server handler for static files.
 *
 * @namespace TeqFw_Web_Back_App_Server_Handler_Static
 */
// MODULE'S IMPORT
import {existsSync, statSync} from 'fs';
import {join} from 'path';
import {constants as H2} from 'http2';

// MODULE'S VARS
const NS = 'TeqFw_Web_Back_App_Server_Handler_Static';
const INDEX_NAME = 'index.html';
const {
    HTTP2_METHOD_GET,
    HTTP_STATUS_OK,
} = H2;

// MODULE'S CLASSES
/**
 * @implements TeqFw_Web_Back_Api_Dispatcher_IHandler
 */
export default class TeqFw_Web_Back_App_Server_Handler_Static {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Web_Back_Defaults} */
        const DEF = spec['TeqFw_Web_Back_Defaults$'];
        /** @type {TeqFw_Core_Shared_Api_ILogger} */
        const logger = spec['TeqFw_Core_Shared_Api_ILogger$$']; // instance
        /** @type {TeqFw_Core_Back_Config} */
        const config = spec['TeqFw_Core_Back_Config$'];
        /** @type {TeqFw_Core_Back_Mod_Init_Plugin_Registry} */
        const regPlugins = spec['TeqFw_Core_Back_Mod_Init_Plugin_Registry$'];
        /** @type {TeqFw_Web_Back_Mod_Address} */
        const mAddress = spec['TeqFw_Web_Back_Mod_Address$'];

        // VARS
        const _rootFs = config.getBoot().projectRoot; // path to project root
        const _rootWeb = join(_rootFs, DEF.FS_STATIC_ROOT); // default path to app web root
        const _routes = {}; // '/src/@teqfw/core' => '/.../node_modules/@teqfw/core/src'

        // FUNCS
        /**
         * Extract static file name from GET request, find file in filesystem then send it back to client.
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest}req
         * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} res
         */
        function process(req, res) {
            // FUNCS
            /**
             * Compose absolute path to requested resource:
             *  - /src/vue/vue.global.js => /.../node_modules/vue/dist/vue.global.js
             *  - /web/@flancer32/teqfw-app-sample/favicon.ico => /.../@flancer32/teqfw-app-sample/web/favicon.ico
             *  - /index.html => /.../web/index.html
             *
             * @param {String} url
             * @returns {String}
             */
            function getFilesystemPath(url) {

                // FUNCS
                /**
                 * Recombine path parts to use as key in URL mapping.
                 *
                 * @param {string} path
                 * @returns {string}
                 */
                function normalize(path) {
                    let result;
                    const parts = path.split('?'); // cut off GET vars
                    const address = mAddress.parsePath(parts[0]);
                    if (address.space !== undefined) {
                        result = `/${address.space}${address.route}`;
                    } else if (address.door !== undefined) {
                        result = `/${address.door}${address.route}`;
                    } else {
                        result = `${address.route}`;
                    }
                    // add 'index.html' for 'web' space
                    if ((
                            (address.space === DEF.SHARED.SPACE_WEB) ||
                            (address.space === undefined)
                        ) &&
                        (result.slice(-1) === '/')
                    ) {
                        result += INDEX_NAME;
                    }
                    return result;
                }

                /**
                 * Map URL to filesystem.
                 *
                 * @param url
                 * @returns {string}
                 */
                function pathMap(url) {
                    let result = url;
                    for (const key in _routes) {
                        const one = _routes[key];
                        const route = `${key}/`.replace('//', '/');
                        const regSrc = new RegExp(`(.*)(${route})(.*)`);
                        const partsSrc = regSrc.exec(url);
                        if (Array.isArray(partsSrc)) {
                            const tail = partsSrc[3];
                            result = `${one}/${tail}`;
                            result = result.replace(/\/\//g, '/');
                            break;
                        }
                    }
                    return result;
                }

                // MAIN
                let result;
                const normal = normalize(url);
                const mapped = pathMap(normal);
                if (normal === mapped) {   // URL w/o mapping should be resolved relative to web root
                    result = join(_rootWeb, normal);
                } else {    // URL with mapping should be resolved relative to project root
                    result = mapped;
                }
                return result;
            }

            // MAIN
            /** @type {TeqFw_Core_Shared_Mod_Map} */
            const shares = res[DEF.HNDL_SHARE];
            if (!res.headersSent && !shares.get(DEF.SHARE_RES_STATUS)) {
                shares.set(DEF.SHARE_RES_FILE, getFilesystemPath(req.url));
                shares.set(DEF.SHARE_RES_STATUS, HTTP_STATUS_OK);
            }
        }

        // INSTANCE METHODS
        this.getProcessor = () => process;

        this.init = async function () {
            logger.info('Initialize Statics web requests handler:');
            const items = regPlugins.items();
            for (const item of items) {
                // map URLs to filesystem for ES6/JS sources
                /** @type {TeqFw_Di_Back_Api_Dto_Plugin_Desc} */
                const desc = item.teqfw?.[DEF.MOD_DI.NAME];
                if (desc?.autoload && desc.autoload.ns) {
                    const path = join(item.path, desc.autoload.path);
                    const url = join('/', DEF.SHARED.SPACE_SRC, item.name);
                    logger.info(`    ${url} => ${path}`);
                    _routes[url] = path;
                }

                // map URLs to filesystem for web resources (styles, images, etc.)
                const pathWeb = join(item.path, DEF.FS_STATIC_ROOT);
                if (existsSync(pathWeb) && statSync(pathWeb).isDirectory()) {
                    const url = join('/', DEF.SHARED.SPACE_WEB, item.name);
                    _routes[url] = pathWeb;
                    logger.info(`    ${url} => ${pathWeb}`);
                }

                // map additional sources mapping
                if (typeof item.teqfw[DEF.SHARED.NAME]?.statics === 'object') {
                    const map = item.teqfw[DEF.SHARED.NAME].statics;
                    for (const key in map) {
                        const path = join(_rootFs, 'node_modules', map[key]);
                        const url = join('/', DEF.SHARED.SPACE_SRC, key);
                        _routes[url] = path;
                        logger.info(`    ${url} => ${path}`);
                    }
                }

            }
        };

        /**
         * @param {string} method
         * @return {boolean}
         */
        this.canProcess = function ({method} = {}) {
            // This handler should stay immediately before Final handler and after all other handlers!
            return (method === HTTP2_METHOD_GET);
        }

        // MAIN
        Object.defineProperty(process, 'namespace', {value: NS});
    }
}
