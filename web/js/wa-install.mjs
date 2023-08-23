/**
 * Frontend installer for ordinary web application. Loads DI configuration and initializes DI.
 * This es6-module is imported with regular 'import' statement, not with DI container.
 * @deprecated use ./bootstrap.mjs
 */
// MODULE'S VARS
const KEY_DI_CONFIG = '@teqfw/web/di/cfg';
const URL_API_DI_NS = './cfg/di';
const URL_SRC_DI_CONTAINER = './src/@teqfw/di/Shared/Container.mjs';

// MODULE'S CLASSES
export class Install {
    constructor() {
        // VARS
        /**
         * CSS selector to mount UI component to launchpad page.
         * @type {string}
         */
        let _cssMount;
        /**
         * Function to trace initialization process.
         * @type {function(string)}
         */
        let _fnPrintout;
        /**
         * Function to trace installation process (%, 0..1).
         * @type {function(number)}
         */
        let _fnProgress;
        /**
         * Namespace for module with front app (Vnd_Plug_Front_App).
         * @type {string}
         */
        let _nsApp;

        // FUNCS
        function print(msg) {
            if (typeof _fnPrintout === 'function') _fnPrintout(msg);
            else console.log(msg);
        }

        // INSTANCE METHODS

        this.setCssMount = (css) => _cssMount = css;

        this.setFnPrintout = (fn) => _fnPrintout = fn;

        this.setFnProgress = (fn) => _fnProgress = fn;

        this.setNsApp = (ns) => _nsApp = ns;

        this.run = async function () {
            // FUNCS

            /**
             * Import code, create and setup Dependency Injection container for frontend.
             *
             * @returns {Promise<TeqFw_Di_Container>}
             */
            async function initDiContainer() {
                // FUNCS

                /**
                 * Load DI configuration from local cache and setup container.
                 * @param {TeqFw_Di_Container} container
                 */
                function configFromCache(container) {
                    try {
                        const stored = window.localStorage.getItem(KEY_DI_CONFIG);
                        const cache = JSON.parse(stored);
                        if (Array.isArray(cache?.sources))
                            for (const item of cache.sources) {
                                const [ns, url, ext] = item;
                                container.addSourceMapping(ns, url, true, ext);
                            }
                        if (Array.isArray(cache?.replaces))
                            for (const item of cache.replaces) {
                                const [orig, alter] = item;
                                container.addModuleReplacement(orig, alter);
                            }
                        print(`DI container is configured from local cache.`);
                    } catch (e) {
                        print(`Cannot load DI configuration for local storage in offline mode. ${e?.message}`);
                    }
                }

                /**
                 * Load DI configuration from server and setup container.
                 * @param {TeqFw_Di_Container} container
                 */
                async function configFromServer(container) {
                    const urlWithPath = `${location.origin}${location.pathname}`;
                    const baseUrl = urlWithPath.endsWith('/') ? urlWithPath.slice(0, -1) : urlWithPath;

                    // load available namespaces from server
                    const res = await fetch(URL_API_DI_NS);
                    /** @type {TeqFw_Web_Shared_Dto_Config_Di.Dto} */
                    const configDi = await res.json();
                    // cache to place to local storage
                    const cache = {sources: [], replaces: []}
                    // add namespaces to container
                    if (Array.isArray(configDi?.namespaces))
                        for (const item of configDi.namespaces) {
                            container.addSourceMapping(item.ns, baseUrl + item.path, true, item.ext);
                            cache.sources.push([item.ns, baseUrl + item.path, item.ext]);
                        }
                    // add replaces to container
                    if (Array.isArray(configDi?.replacements))
                        for (const item of configDi.replacements) {
                            container.addModuleReplacement(item.orig, item.alter);
                            cache.replaces.push([item.orig, item.alter]);
                        }
                    window.localStorage.setItem(KEY_DI_CONFIG, JSON.stringify(cache));
                    print(`DI container is configured from server. Local cache is updated.`);
                }

                // MAIN
                // load sources and create DI Container
                const {default: Container} = await import(URL_SRC_DI_CONTAINER);
                /** @type {TeqFw_Di_Container} */
                const container = new Container();
                if (navigator.onLine) await configFromServer(container)
                else configFromCache(container);
                return container;
            }

            // MAIN
            try {
                const mode = navigator.onLine ? 'online' : 'offline';
                print(`Bootstrap is started in '${mode}' mode.`);
                // initialize objects loader (Dependency Injection container)
                const container = await initDiContainer();
                print(`Creating new app instance using DI...`);
                // create Vue application and mount it to the page
                /** @type {TeqFw_Web_Front_Api_IApp} */
                const app = await container.get(`${_nsApp}$`);
                print(`Initializing app instance...`);
                if (await app.init(print)) {
                    print(`Mounting app instance...`);
                    await app.mount(_cssMount);
                } else {
                    print(`Reinstall app instance...`);
                    await app.reinstall(_cssMount);
                }
            } catch (e) {
                print(`Error in bootstrap: ${e.message}. ${e.stack}`);
            }
        }
    }
}
