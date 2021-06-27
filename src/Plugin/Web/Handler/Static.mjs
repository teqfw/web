/**
 * Web request handler for static files.
 *
 * @namespace TeqFw_Web_Plugin_Web_Handler_Static
 */
// MODULE'S IMPORT
import $fs from 'fs';
import $mimeTypes from 'mime-types';
import $path from 'path';
import {constants as H2} from 'http2';


// MODULE'S VARS
const NS = 'TeqFw_Web_Plugin_Web_Handler_Static';
const INDEX_NAME = 'index.html';

// MODULE'S CLASSES


// MODULE'S FUNCTIONS
/**
 * Factory to setup execution context and to create handler to process static files.
 *
 * @param {TeqFw_Di_SpecProxy} spec
 * @constructor
 * @memberOf TeqFw_Web_Plugin_Web_Handler_Static
 */
function Factory(spec) {
    // EXTRACT DEPS
    /** @type {TeqFw_Web_Defaults} */
    const DEF = spec['TeqFw_Web_Defaults$'];
    /** @type {TeqFw_Core_Logger} */
    const logger = spec['TeqFw_Core_Logger$'];
    /** @type {TeqFw_Core_Back_App.Bootstrap} */
    const bootstrap = spec['TeqFw_Core_Back_App#Bootstrap$'];
    /** @type {TeqFw_Core_Back_Scan_Plugin_Registry} */
    const regPlugins = spec['TeqFw_Core_Back_Scan_Plugin_Registry$'];
    /** @type {TeqFw_Http2_Back_Model_Realm_Registry} */
    const regAreas = spec['TeqFw_Http2_Back_Model_Realm_Registry$']; // TODO: remove it
    /** @type {TeqFw_Core_Back_Api_Dto_Plugin_Desc_Autoload.Factory} */
    const fDescAutoload = spec['TeqFw_Core_Back_Api_Dto_Plugin_Desc_Autoload#Factory$'];

    // PARSE INPUT & DEFINE WORKING VARS
    const rootFs = bootstrap.root; // path to project root
    const rootWeb = $path.join(rootFs, DEF.FS_STATIC_ROOT); // default path to app web root
    const routes = {}; // '/src/@teqfw/core' => '/.../node_modules/@teqfw/core/src'

    // DEFINE INNER FUNCTIONS
    /**
     * Action to process web request for static files.
     *
     * @param {TeqFw_Web_Back_Api_Request_Context} context
     * @returns {Promise<void>}
     * @memberOf TeqFw_Web_Plugin_Web_Handler_Static
     */
    async function handle(context) {
        // DEFINE INNER FUNCTIONS
        /**
         * Compose absolute path to requested resource:
         *  - /src/vue/vue.global.js => /.../node_modules/vue/dist/vue.global.js
         *  - /web/@flancer32/teqfw-app-sample/favicon.ico => /.../@flancer32/teqfw-app-sample/web/favicon.ico
         *  - /index.html => /.../web/index.html
         *
         * @param {String} url
         * @returns {String}
         */
        function getPath(url) {

            // DEFINE INNER FUNCTIONS
            function normalize(path) {
                let result = path;
                const addr = regAreas.parseAddress(path);
                if (addr.zone !== undefined) {
                    result = `/${addr.zone}${addr.route}`;
                } else if (addr.area !== undefined) {
                    result = `/${addr.area}${addr.route}`;
                } else {
                    result = `${addr.route}`;
                }
                // add 'index.html' for 'web' area
                if (
                    (addr.zone !== DEF.ZONE.API) &&
                    (addr.zone !== DEF.ZONE.SRC) &&
                    (result.slice(-1) === '/')
                ) {
                    result += INDEX_NAME;
                }
                return result;
            }

            function pathMap(url) {
                let result = url;
                for (const key in routes) {
                    const one = routes[key];
                    const regSrc = new RegExp(`(.*)(${key})(.*)`);
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

            // MAIN FUNCTIONALITY
            let result;
            const normal = normalize(url);
            const mapped = pathMap(normal);
            if (normal === mapped) {   // URL w/o mapping should be resolved relative to web root
                result = $path.join(rootWeb, normal);
            } else {    // URL w mapping should be resolved relative to project root
                result = mapped;
            }
            return result;
        }

        // MAIN FUNCTIONALITY

        /** @type {TeqFw_Web_Back_Api_Request_Context} */
        const ctx = context; // IDEA is failed with context help (suggestions on Ctrl+Space)
        if (!ctx.isRequestProcessed()) {
            // process only unprocessed requests
            const webPath = ctx.getPath();
            const path = getPath(webPath);
            if ($fs.existsSync(path) && $fs.statSync(path).isFile()) {
                const mimeType = $mimeTypes.lookup(path);
                if (mimeType) {
                    ctx.setOutFilePath(path);
                    ctx.setOutHeader(H2.HTTP2_HEADER_CONTENT_TYPE, mimeType)
                    ctx.setRequestProcessed();
                }
            }
        }
    }

    /**
     * Process plugins descriptions and setup static resources mapping.
     */
    function initMapping() {
        logger.debug('Map plugins folders for static resources:');
        const items = regPlugins.items();
        for (const item of items) {
            // map URLs to filesystem for ES6/JS sources
            const data = item.teqfw?.autoload;
            if (data) {
                /** @type {TeqFw_Core_Back_Api_Dto_Plugin_Desc_Autoload} */
                const desc = fDescAutoload.create(data);
                const path = $path.join(item.path, desc.path);
                const url = $path.join('/', DEF.ZONE.SRC, item.name);
                logger.debug(`    ${url} => ${path}`);
                routes[url] = path;

            }

            // map URLs to filesystem for web resources (styles, images, etc.)
            const pathWeb = $path.join(item.path, DEF.FS_STATIC_ROOT);
            if ($fs.existsSync(pathWeb) && $fs.statSync(pathWeb).isDirectory()) {
                const url = $path.join('/', DEF.ZONE.WEB, item.name);
                routes[url] = pathWeb;
                logger.debug(`    ${url} => ${pathWeb}`);
            }

            // map additional sources mapping
            if (typeof item.teqfw[DEF.REALM]?.statics === 'object') {
                const map = item.teqfw[DEF.REALM].statics;
                for (const key in map) {
                    const path = $path.join(rootFs, 'node_modules', map[key]);
                    const url = $path.join('/', DEF.ZONE.SRC, key);
                    routes[url] = path;
                    logger.debug(`    ${url} => ${path}`);
                }
            }

        }
        logger.debug('All static resources are mapped.');
    }

    // MAIN FUNCTIONALITY
    initMapping();

    // COMPOSE RESULT
    Object.defineProperty(handle, 'name', {value: `${NS}.${handle.name}`});
    return handle;
}

// MODULE'S FUNCTIONALITY

// MODULE'S EXPORT
Object.defineProperty(Factory, 'name', {value: `${NS}.${Factory.constructor.name}`});
export {
    Factory as default,
};
