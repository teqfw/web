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

export default class TeqFw_Web_Front_Api_ServiceWorker {

    constructor() {

        /**
         *
         * @param {WorkerGlobalScope} context
         */
        this.setup = function (context) {
            context.addEventListener('install', event => {
                console.log('V1 installing…');

                // cache a cat SVG
                event.waitUntil(
                    caches.open('static-v1').then(cache => cache.add('cat.svg'))
                );
            });

            context.addEventListener('activate', event => {
                console.log('V1 now ready to handle fetches!');
            });

            context.addEventListener('fetch', event => {
                const url = new URL(event.request.url);

                // serve the cat SVG from the cache if the request is
                // same-origin and the path is '/dog.svg'
                console.log(url.pathname);
                console.log(url.origin);
                if (url.origin == location.origin && url.pathname == '/sw/dog.svg') {
                    event.respondWith(caches.match('cat.svg'));
                }
            });
        }
    }

}
