/**
 * Frontend bootstrap registers Service Worker, loads DI configuration and initializes DI.
 */
// MODULE'S VARS
const KEY_DI_CONFIG = '@teqfw/web/di/cfg';
const URL_API_DI_NS = './api/@teqfw/web/load/namespaces';
const URL_SRC_DI_CONTAINER = './src/@teqfw/di/Shared/Container.mjs';

// MODULE'S CLASSES
export class Bootstrap {
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

        /**
         * CSS selector for main UI component mount point ('BODY > DIV').
         * @param {string} css
         */
        this.setCssMount = (css) => _cssMount = css;

        /**
         * Setup printout function to trace bootstrap process
         * @param fn
         */
        this.setFnPrintout = (fn) => _fnPrintout = fn;
        /**
         * Setup namespace for frontend app to launch (Ns_Vnd_Front_App).
         * @param {string} ns
         */
        this.setNsApp = (ns) => _nsApp = ns;

        this.run = async function () {
            // FUNCS

            /**
             * Init DI container, load front application sources, create and run application.
             * @return {Promise<void>}
             */
            async function bootstrap() {
                // FUNCS

                /**
                 * Import code, create and setup Dependency Injection container for frontend.
                 *
                 * @returns {Promise<TeqFw_Di_Shared_Container>}
                 */
                async function initDiContainer() {
                    // FUNCS

                    /**
                     * Load DI configuration from local cache and setup container.
                     * @param {TeqFw_Di_Shared_Container} container
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
                     * @param {TeqFw_Di_Shared_Container} container
                     */
                    async function configFromServer(container) {
                        const urlWithPath = `${location.origin}${location.pathname}`;
                        const baseUrl = urlWithPath.endsWith('/') ? urlWithPath.slice(0, -1) : urlWithPath;

                        // load available namespaces from server
                        const res = await fetch(URL_API_DI_NS);
                        const json = await res.json();
                        // cache to place to local storage
                        const cache = {sources: [], replaces: []}
                        // add namespaces to container
                        if (json?.data?.items && Array.isArray(json.data.items))
                            for (const item of json.data.items) {
                                container.addSourceMapping(item.ns, baseUrl + item.path, true, item.ext);
                                cache.sources.push([item.ns, baseUrl + item.path, item.ext]);
                            }
                        // add replaces to container
                        if (json?.data?.replaces && Array.isArray(json.data.replaces))
                            for (const item of json.data.replaces) {
                                container.addModuleReplacement(item.orig, item.alter);
                                cache.replaces.push([item.orig, item.alter]);
                            }
                        window.localStorage.setItem(KEY_DI_CONFIG, JSON.stringify(cache));
                        print(`DI container is configured from server. Local cache is updated.`);
                    }

                    // MAIN
                    // load sources and create DI Container
                    const {default: Container} = await import(URL_SRC_DI_CONTAINER);
                    /** @type {TeqFw_Di_Shared_Container} */
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
                    await app.init(print);
                    print(`Mounting app instance...`);
                    await app.mount(_cssMount);
                } catch (e) {
                    print(`Error in bootstrap: ${e.message}. ${e.stack}`);
                }
            }

            // MAIN
            if ('serviceWorker' in navigator) { // if browser supports service workers
                // ... then add event handler to run script after window will be loaded
                // (https://developer.mozilla.org/en-US/docs/Web/API/Window/load_event)
                const worker = navigator.serviceWorker;
                if (worker.controller === null) {
                    // ... then load 'sw.js' script and register service worker in navigator
                    try {
                        print(`Try to register new service worker (load 'sw.js').`);
                        const reg = await worker.register('sw.js', {type: 'module'});
                        if (reg.active) {
                            print(`SW is registered and is active. Start app bootstrap.`);
                            await bootstrap();
                        } else {
                            print(`SW is registered but is not activated yet.`);
                            // wait for `controllerchange` (see `clients.claim()` in SW code on `activate` event)
                            worker.addEventListener('controllerchange', async () => {
                                print(`SW just installed (page's first load). Start app bootstrap.`);
                                await bootstrap();
                            });
                        }
                    } catch (e) {
                        print(`SW registration is failed: ${e}\n${e.stack}`)
                    }
                } else {
                    // SW already installed before (repeated loading of the page).
                    print('SW is already installed for this app.');
                    await bootstrap();
                }
            } else {
                print(`Cannot start PWA. This browser has no Service Workers support.`);
            }
        }
    }
}
