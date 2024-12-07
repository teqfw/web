/**
 * Web server handler for static files.
 *
 * @namespace TeqFw_Web_Back_App_Server_Handler_Static
 */
// MODULE'S IMPORT
import {constants as H2} from 'node:http2';
import {existsSync, statSync} from 'node:fs';
import {join} from 'node:path';
import {platform} from 'node:process';

// MODULE'S VARS
const NS = 'TeqFw_Web_Back_App_Server_Handler_Static';
const INDEX_NAME = 'index.html';
const {
    HTTP2_METHOD_GET,
    HTTP_STATUS_OK,
} = H2;
const IS_WIN = (platform === 'win32');

// MODULE'S CLASSES
/**
 * @implements TeqFw_Web_Back_Api_Dispatcher_IHandler
 */
export default class TeqFw_Web_Back_App_Server_Handler_Static {
    /**
     * @param {TeqFw_Web_Back_Defaults} DEF
     * @param {TeqFw_Core_Shared_Api_Logger} logger -  instance
     * @param {TeqFw_Core_Back_Config} config
     * @param {TeqFw_Core_Back_Api_Plugin_Registry} regPlugins
     * @param {TeqFw_Web_Back_Mod_Address} mAddress
     */
    constructor(
        {
            TeqFw_Web_Back_Defaults$: DEF,
            TeqFw_Core_Shared_Api_Logger$$: logger,
            TeqFw_Core_Back_Config$: config,
            TeqFw_Core_Back_Api_Plugin_Registry$: regPlugins,
            TeqFw_Web_Back_Mod_Address$: mAddress,
        }) {
        // VARS
        const _rootFs = config.getPathToRoot(); // path to project root
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
                    const decoded = decodeURI(path); // convert %20 to ' '
                    const parts = decoded.split('?'); // cut off GET vars
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
                 * Map plugin related URL to filesystem:
                 *  ' /web/@teqfw/web/js/bootstrap.mjs' => 'C:\...\node_modules\@teqfw\web\web\js\bootstrap.mjs'
                 *  ' /web/@teqfw/web/js/bootstrap.mjs' => '/.../node_modules/@teqfw/web/web/js/bootstrap.mjs'
                 *
                 * @param url
                 * @returns {string}
                 */
                function pathMap(url) {
                    let result = url;
                    for (const key in _routes) { // OS dependent
                        const path = _routes[key]; // OS dependent
                        const keyNorm = (IS_WIN) ? key.replace(/\\/g, '/') : key; // linux style
                        const route = `${keyNorm}/`.replace(/\/\//g, '/'); // remove '//'
                        const regSrc = new RegExp(`(.*)(${route})(.*)`);
                        const partsSrc = regSrc.exec(url);
                        if (Array.isArray(partsSrc)) {
                            const tail = partsSrc[3];
                            result = `${path}/${tail}`;
                            result = result.replace(/\/\//g, '/');
                            if (IS_WIN) {
                                // convert URL to win-style
                                const tailWin = tail.replace(/\//g, '\\');
                                result = `${path}\\${tailWin}`;
                                result = result.replace(/\\\\/g, '\\');
                            } else {
                                result = `${path}/${tail}`;
                                result = result.replace(/\/\//g, '/');
                            }
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
            /** @type {Object} */
            const shares = res[DEF.HNDL_SHARE];
            if (!res.headersSent && !shares[DEF.SHARE_RES_STATUS]) {
                const path = getFilesystemPath(req.url);
                if (existsSync(path)) {
                    shares[DEF.SHARE_RES_FILE] = path;
                    shares[DEF.SHARE_RES_STATUS] = HTTP_STATUS_OK;
                }
            }
        }

        // INSTANCE METHODS
        this.getProcessor = () => process;

        this.init = async function () {
            logger.info('Initialize Statics web requests handler:');
            const items = regPlugins.items();
            for (const item of items) {
                // map URLs to filesystem for ES6/JS sources
                /** @type {TeqFw_Core_Back_Plugin_Dto_Desc_Di.Dto} */
                const desc = item.teqfw?.[DEF.MOD_CORE.SHARED.NAME_DI];
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
         * @returns {boolean}
         */
        this.canProcess = function ({method} = {}) {
            // This handler should stay immediately before Final handler and after all other handlers!
            return (method === HTTP2_METHOD_GET);
        };

        // MAIN
        Object.defineProperty(process, 'namespace', {value: NS});
    }
}
