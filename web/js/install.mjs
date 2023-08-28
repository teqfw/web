/**
 * Frontend app installer registers Service Worker, loads DI configuration and initializes DI.
 * This es6-module is imported with regular 'import' statement, not with DI container.
 * @deprecated use ./bootstrap.mjs
 */
// MODULE'S VARS
const KEY_DI_CONFIG = '@teqfw/web/di/cfg';
const URL_API_DI_NS = './cfg/di';
const URL_SRC_DI_CONTAINER = './src/@teqfw/di/Container.js';
const URL_SRC_DI_PARSER_OLD = './src/@teqfw/di/Parser/Old.js';

/**
 * @interface
 */
class InstallInterface {

    /**
     * Main method thar executes app installation.
     * @return {Promise<void>}
     */
    run() {}

    /**
     * CSS selector for main UI component mount point (example: 'BODY > DIV').
     * @param {string} css
     */
    setCssMount(css) {}

    /**
     * Setup printout function to trace bootstrap process.
     * @param {function} fn
     */
    setFnPrintout(fn) {}

    /**
     * Setup namespace for frontend app to launch (example: 'Ns_Vnd_Front_App').
     * @param {string} ns
     */
    setNsApp(ns) {}
}

// MODULE'S CLASSES
/**
 * @implements InstallInterface
 */
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
             * Init DI container, load front application sources, create and run application.
             * @return {Promise<void>}
             */
            async function bootstrap() {
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
                            // add namespaces to container
                            if (Array.isArray(cache?.sources)) {
                                const resolver = container.getResolver();
                                for (const item of cache.sources) {
                                    const [ns, url, ext] = item;
                                    resolver.addNamespaceRoot(ns, url, ext);
                                }
                            }
                            if (Array.isArray(cache?.replaces)) {
                                const preProcessor = container.getPreProcessor();
                                const handlers = preProcessor.getHandlers();
                                /** @type {TeqFw_Di_PreProcessor_Replace|function} */
                                const replace = handlers.find((one) => one.name === 'TeqFw_Di_PreProcessor_Replace');
                                for (const item of cache.replaces) {
                                    const [orig, alter] = item;
                                    replace.add(orig, alter);
                                }
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
                        const resolver = container.getResolver();
                        if (Array.isArray(configDi?.namespaces))
                            for (const item of configDi.namespaces) {
                                resolver.addNamespaceRoot(item.ns, baseUrl + item.path, item.ext);
                                cache.sources.push([item.ns, baseUrl + item.path, item.ext]);
                            }
                        // add replaces to container
                        const preProcessor = container.getPreProcessor();
                        const handlers = preProcessor.getHandlers();
                        /** @type {TeqFw_Di_PreProcessor_Replace|function} */
                        const replace = handlers.find((one) => one.name === 'TeqFw_Di_PreProcessor_Replace');
                        if (Array.isArray(configDi?.replacements))
                            for (const item of configDi.replacements) {
                                replace.add(item.orig, item.alter);
                                cache.replaces.push([item.orig, item.alter]);
                            }
                        window.localStorage.setItem(KEY_DI_CONFIG, JSON.stringify(cache));

                        // set old format parser for TeqFw_
                        const {default: parserOld} = await import(URL_SRC_DI_PARSER_OLD);
                        const validate = function (key) {
                            return (key.indexOf('TeqFw_Core_') === 0) ||
                                (key.indexOf('TeqFw_Test_') === 0) ||
                                (key.indexOf('TeqFw_Ui_Quasar_') === 0) ||
                                (key.indexOf('TeqFw_Vue_') === 0) ||
                                (key.indexOf('TeqFw_Web_') === 0) ||
                                (key.indexOf('TeqFw_Web_Api_') === 0) ||
                                (key.indexOf('TeqFw_Web_Event_') === 0);
                        };
                        container.getParser().addParser(validate, parserOld);
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

            // MAIN
            if ('serviceWorker' in navigator) { // if browser supports service workers
                const container = navigator.serviceWorker;
                if (container.controller === null) {
                    // ... then load 'sw.js' script and register service worker in navigator
                    try {
                        // print out installation progress on startup page
                        container.addEventListener('message', (event) => {
                            if (typeof _fnProgress === 'function') _fnProgress(event.data?.progress);
                        });

                        print(`Try to register new service worker (load 'sw.js').`);
                        const reg = await container.register('sw.js', {type: 'module'});
                        if (reg.active) {
                            print(`SW is registered and is active. Start app bootstrap.`);
                            await bootstrap();
                        } else {
                            print(`SW is registered but is not activated yet.`);
                            // wait for `controllerchange` (see `clients.claim()` in SW code on `activate` event)
                            container.addEventListener('controllerchange', async () => {
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
