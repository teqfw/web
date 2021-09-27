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

export default class TeqFw_Web_Front_Api_ServiceWorker {

    constructor() {
        // ATTN: This is standard ES6 module w/o TeqFW DI support !!!

        // DEFINE INNER FUNCTIONS

        function onActivate(event) {
            console.log('V1 now ready to handle fetches!');
        }

        function onFetch(event) {
            const url = new URL(event.request.url);

            // serve the cat SVG from the cache if the request is
            // same-origin and the path is '/dog.svg'
            console.log(url.pathname);
            console.log(url.origin);
            if (url.origin === location.origin && url.pathname === '/sw/dog.svg') {
                event.respondWith(caches.match('cat.svg'));
            }
        }

        function onInstall(event) {
            // DEFINE INNER FUNCTIONS
            async function loadFilesToCache() {
                // Get list of static files
                const req = new Request(API_STATIC_FILES);
                const resp = await self.fetch(req);
                const json = await resp.json();
            }

            // MAIN FUNCTIONALITY
            console.log('V1 installing…');
            event.waitUntil(
                caches.open('static-v1')
                    .then(cache => cache.add('cat.svg'))
                    .then(loadFilesToCache)
            );
        }

        // DEFINE INSTANCE METHODS

        /**
         * Bind event handlers to worker's scope.
         * @param {WorkerGlobalScope} context
         */
        this.setup = function (context) {
            context.addEventListener('activate', onActivate);
            context.addEventListener('fetch', onFetch);
            context.addEventListener('install', onInstall);
        }
    }

}
