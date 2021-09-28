/**
 * Service worker to use in TeqFW applications.
 * This is standard ES6 module w/o TeqFW DI support. Service workers don't allow dynamic `import()`.
 */

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

export default class TeqFw_Web_Front_Api_ServiceWorker {

    /**
     * ATTN: This is standard ES6 module w/o TeqFW DI support !!!
     */
    constructor() {
        // DEFINE WORKING VARS / PROPS
        /**
         * Entry point for the frontend application ('pub', 'admin').
         * @type {string}
         */
        let _door;

        // DEFINE INNER FUNCTIONS

        /**
         * Send message to `index.html` to start bootstrap.
         */
        function onActivate(event) {
            self.clients.claim();
        }

        function onFetch(event) {
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
                event.respondWith(getFromCacheOrFetchAndCache(event));
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

        // DEFINE INSTANCE METHODS

        /**
         * Bind event handlers to worker's scope.
         * @param {WorkerGlobalScope} context
         * @param {string} door entry point for the front of application
         */
        this.setup = function (context, door) {
            _door = door;
            context.addEventListener('activate', onActivate);
            context.addEventListener('fetch', onFetch);
            context.addEventListener('install', onInstall);
            console.log(`[SW]: is registering for '${_door}' entry point.`);
        }
    }

}
