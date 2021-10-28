/**
 * Main script to use service worker in TeqFW applications.
 *
 * This is standard ES6 module w/o TeqFW DI support (service workers don't allow dynamic `import()`).
 *
 * I suppose that SW files should be cached by browser itself, so these files are not under `./Front/` folder.
 */
import Config from './Config.mjs';
import MSG from '../Front/Model/Sw/Enum/Message.mjs';

/**
 * Service Worker events.
 */
const EVT = {
    ACTIVATE: 'activate',
    CONTENT_DELETE: 'contentdelete',
    FETCH: 'fetch',
    INSTALL: 'install',
    LANGUAGE_CHANGE: 'languagechange',
    MESSAGE: 'message',
    NOTIFICATION_CLICK: 'notificationclick',
    NOTIFICATION_CLOSE: 'notificationclose',
    PERIODIC_SYNC: 'periodicsync',
    PUSH: 'push',
    PUSH_SUBSCRIPTION_CHANGE: 'pushsubscriptionchange',
    SYNC: 'sync',
};
const API_STATIC_FILES = '/api/@teqfw/web/load/files_to_cache'; // get list of files to cache on SW installation
const AREA_API = 'api'; // marker for API routes (don't cache)
const AREA_STATIC = 'web'; // marker for static resources (to be cached)
const AREA_WORKER = 'sw'; // marker for Service Worker commands
const CACHE_STATIC = 'static-cache-v1'; // store name to cache static resources
const CFG_CACHE_DISABLED = 'cache_disabled';

export default class TeqFw_Web_Sw_Worker {

    /**
     * ATTN: This is standard ES6 module w/o TeqFW DI support !!!
     */
    constructor() {
        // DEFINE WORKING VARS / PROPS
        /**
         * Configuration object for SW. It is stored in IDB and is reloaded on service worker start.
         * @type {TeqFw_Web_Sw_Config}
         */
        const _config = new Config();
        /**
         * Entry point for the frontend application ('pub', 'admin').
         * @type {string}
         */
        let _door;
        /** @type {boolean} */
        let _cacheDisabled;

        // DEFINE INNER FUNCTIONS

        /**
         * Send message to `index.html` to start bootstrap.
         */
        function onActivate(event) {
            console.log(`[SW]: on activate event is here...`);
            self.clients.claim();
        }

        function onFetch(event) {
            // DEFINE WORKING VARS / PROPS

            // DEFINE INNER FUNCTIONS
            /**
             * Analyze route's URL and return route type (api, service worker or static).
             * @param {Request} req
             * @returns {string}
             */
            function getRouteType(req) {
                const API = /(.*)(\/api\/)(.*)/;
                const SW = /(.*)(\/sw\/)(.*)/;
                if (req.url.match(API)) {
                    return AREA_API;
                } else if (req.url.match(SW)) {
                    return AREA_WORKER;
                }
                return AREA_STATIC;
            }

            async function getFromCacheOrFetchAndCache(event) {
                try {

                    const cache = await self.caches.open(CACHE_STATIC);
                    const cachedResponse = await cache.match(event.request);
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    // wait until resource will be fetched from server and stored in cache
                    const resp = await fetch(event.request);
                    await cache.put(event.request, resp.clone());
                    return resp;
                } catch (e) {
                    console.log('[SW] error: ');
                    console.dir(e);
                }
            }

            // MAIN FUNCTIONALITY
            const routeType = getRouteType(event.request);
            if (routeType === AREA_API) {
                // just pass the request to remote server
            } else {
                if (_cacheDisabled !== true) {
                    event.respondWith(getFromCacheOrFetchAndCache(event));
                }
            }
        }

        function onInstall(event) {
            // DEFINE INNER FUNCTIONS
            async function loadFilesToCache() {
                // Get list of static files from the server
                const data = {door: _door}; // see TeqFw_Web_Shared_Service_Route_Load_FilesToCache.Request
                const req = new Request(API_STATIC_FILES, {method: 'POST', body: JSON.stringify({data})});
                const resp = await self.fetch(req);
                const json = await resp.json();
                return json?.data?.items ?? [];
            }

            async function cacheStatics(urls) {
                try {
                    if (Array.isArray(urls)) {
                        // ... and load static files to the local cache
                        const cacheStat = await caches.open(CACHE_STATIC);
                        // await cacheStat.addAll(files);
                        await Promise.all(
                            urls.map(function (url) {
                                return cacheStat.add(url).catch(function (reason) {
                                    console.log(`'${url}' failed: ${String(reason)}`);
                                });
                            })
                        );
                    }
                } catch (e) {
                    console.log('[SW] install error: ');
                    console.dir(e);
                }
            }

            // MAIN FUNCTIONALITY
            event.waitUntil(
                loadFilesToCache()
                    .then(cacheStatics)
                    .catch((err) => {
                        console.log('[SW] error: ');
                        console.dir(err);
                    })
            );
        }

        /**
         * @param {MessageEvent} event
         */
        async function onMessage(event) {
            /** @type {TeqFw_Web_Front_Model_Sw_Control.Message} */
            const data = event.data;
            const type = data.type;
            const payload = data.payload;
            let out;
            // perform requested operation
            if (type === MSG.CACHE_STATUS_GET) {
                _cacheDisabled = await _config.get(CFG_CACHE_DISABLED);
                out = !_cacheDisabled; // inversion for cache status
            } else if (type === MSG.CACHE_STATUS_SET) {
                _cacheDisabled = !payload; // inversion for cache status
                await _config.set(CFG_CACHE_DISABLED, _cacheDisabled);
            } else if (type === MSG.CACHE_CLEAN) {
                debugger
            }
            // ... then return result
            const res = Object.assign({}, data);
            res.payload = out;
            // noinspection JSCheckFunctionSignatures
            event.source.postMessage(res);
        }

        // DEFINE INSTANCE METHODS

        /**
         * Bind event handlers to worker's scope.
         * @param {WorkerGlobalScope} context
         * @param {string} door entry point for the front of application
         */
        this.setup = function (context, door) {
            _door = door;
            context.addEventListener(EVT.ACTIVATE, onActivate);
            context.addEventListener(EVT.FETCH, onFetch);
            context.addEventListener(EVT.INSTALL, onInstall);
            context.addEventListener(EVT.MESSAGE, onMessage);
            console.log(`[SW]: is registering for '${_door}' entry point.`);
        }

        // MAIN FUNCTIONALITY
        _config.get(CFG_CACHE_DISABLED).then((disabled) => _cacheDisabled = disabled);
    }

}
