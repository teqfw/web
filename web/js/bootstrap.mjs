/**
 * Frontend bootstrap registers Service Worker, loads DI configuration and initializes DI.
 */
// MODULE'S VARS
const KEY_DI_CONFIG = '@teqfw/web/di/cfg';
const URL_API_DI_NS = './cfg/di';
const URL_SRC_DI_CONTAINER = './src/@teqfw/di/Container.js';
const URL_SRC_DI_PARSER_OLD = './src/@teqfw/di/Parser/Old.js';

// MODULE'S FUNCS
/**
 * Install Service Worker on page load then start bootstrap code.
 * @param {function(string)} fnLog
 * @param {function(number)} fnProgress
 * @param {string} urlSw 'sw.js'
 * @param {string} nsApp 'Project_Front_App'
 * @param {string} cssApp CSS selector to mount Vue root component ('#id')
 * @returns {Promise<void>}
 */
export async function bootstrap(fnLog, fnProgress, urlSw, nsApp, cssApp) {

    // FUNCS

    /**
     * Init DI container, load front application sources, create and run application.
     * @param {string} app
     * @param {string} selector
     * @return {Promise<void>}
     */
    async function launchApp(app, selector) {
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
                    log(`DI container is configured from local cache.`);
                } catch (e) {
                    log(`Cannot load DI configuration for local storage in offline mode. ${e?.message}`);
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
                        (key.indexOf('TeqFw_I18n_') === 0) ||
                        (key.indexOf('TeqFw_Test_') === 0) ||
                        (key.indexOf('TeqFw_Ui_Quasar_') === 0) ||
                        (key.indexOf('TeqFw_Vue_') === 0) ||
                        (key.indexOf('TeqFw_Web_') === 0) ||
                        (key.indexOf('TeqFw_Web_Api_') === 0);
                };
                container.getParser().addParser(validate, parserOld);

                log(`DI container is configured from server. Local cache is updated.`);
            }

            // MAIN
            // load sources and create DI Container
            const {default: Container} = await import(URL_SRC_DI_CONTAINER);
            /** @type {TeqFw_Di_Container} */
            const container = new Container();
            container.setDebug(true);
            if (navigator.onLine) await configFromServer(container)
            else configFromCache(container);
            return container;
        }

        // MAIN
        try {
            const mode = navigator.onLine ? 'online' : 'offline';
            log(`Bootstrap is started in '${mode}' mode.`);
            // initialize objects loader (Dependency Injection container)
            const container = await initDiContainer();
            log(`Creating new app instance using DI...`);
            // create Vue application and mount it to the page
            /** @type {TeqFw_Web_Front_Api_IApp} */
            const frontApp = await container.get(`${app}$`);
            log(`Initializing app instance...`);
            await frontApp.init(log);
            log(`Mounting app instance to '${cssApp}'...`);
            await frontApp.mount(selector);
        } catch (e) {
            log(`Error in bootstrap: ${e.message}. ${e.stack}`);
        }
    }

    /**
     * Wrapper for external trace function.
     * @param msg
     */
    function log(msg) {
        if (typeof fnLog === 'function') fnLog(msg);
        else console.log(msg);
    }

    // MAIN
    if ('serviceWorker' in navigator) { // if browser supports service workers
        // ... then add event handler to run script after window will be loaded
        // (https://developer.mozilla.org/en-US/docs/Web/API/Window/load_event)
        const worker = navigator.serviceWorker;
        if (worker.controller === null) {
            // ... then load 'sw.js' script and register service worker in navigator
            try {
                if (urlSw) {
                    log(`Try to register new service worker (load '${urlSw}').`);
                    const reg = await worker.register(urlSw, {type: 'module'});
                    if (reg.active) {
                        log(`SW is registered and is active. Start app bootstrap.`);
                        await launchApp(nsApp, cssApp);
                    } else {
                        log(`SW is registered but is not activated yet.`);
                        // wait for `controllerchange` (see `clients.claim()` in SW code on `activate` event)
                        worker.addEventListener('controllerchange', async () => {
                            log(`SW just installed (page's first load). Start app bootstrap.`);
                            await launchApp(nsApp, cssApp);
                        });
                    }
                } else {
                    log(`Starting up without service worker.`);
                    await launchApp(nsApp, cssApp);
                }
            } catch (e) {
                log(`SW registration is failed: ${e}\n${e.stack}`)
            }
        } else {
            // SW already installed before (repeated loading of the page).
            log('SW is already installed for this app.');
            await launchApp(nsApp, cssApp);
        }
    } else {
        log(`Cannot start PWA. This browser has no Service Workers support.`);
    }
}