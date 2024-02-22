/**
 * Main script to use service worker in TeqFW applications.
 *
 * This is standard ES6 module w/o TeqFW DI support (service workers don't allow dynamic `import()`).
 *
 * I suppose that SW files should be cached by browser itself, so these files are not under `./Auth/` folder.
 * @namespace TeqFw_Web_Sw_Worker
 */
// MODULE'S IMPORT
import Config from './Config.mjs';
import CFG_MSG from '../Front/Mod/Sw/Enum/Message.mjs';
import {unzip} from '../../../src/unzipit/unzipit.module.js';

// MODULE'S VARS
const NS = 'TeqFw_Web_Sw_Worker';
const CACHE_STATIC = 'static-cache-v1'; // store name to cache static resources
const CFG_CACHE_DISABLED = 'cache_disabled';
/**
 * Service Worker events.
 * TODO: extract codifier to standalone es6-module to import in other scripts.
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
const URL_CFG_SW_CACHE = '/cfg/sw_cache'; // get list of files to cache on SW installation
const MSG = {PROGRESS: 'PROGRESS'};


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
let _cacheDisabled = true; // disable by default TODO: invert logic here and in IndexedDB
/**
 * Log function to trace functionality of this module.
 * @type {function(msg:string, meta:Object=)}
 */
let _log;

// MODULE'S FUNCS

/**
 * Send message to `index.html` to start bootstrap.
 */
function onActivate() {
    _log(`[TeqFw_Web_Sw_Worker]: on activate event is here...`);
    self.clients.claim();
}

/**
 * @param {FetchEvent} event
 * @memberOf TeqFw_Web_Sw_Worker
 */
function onFetch(event) {
    // FUNCS
    /**
     * Analyze route's URL and return 'true' if request should not be cached.
     * @param {Request} req
     * @returns {boolean}
     * TODO: bypass filter should be extendable
     */
    function detectBypass(req) {
        // see TeqFw_Web_Shared_Defaults.SPACE_...
        const API = /(.*)(\/api\/)(.*)/;
        const CFG = /(.*)(\/cfg\/)(.*)/;
        const EBF = /(.*)(\/ebf\/)(.*)/; // events 'back-to-front'
        const EFB = /(.*)(\/efb\/)(.*)/; // events 'front-to-back'
        const SSE_OPEN = /(.*)(\/web-event-stream-open\/)(.*)/; // events 'front-to-back'
        const res = !!(
            req.method === 'POST' ||
            req.url.match(API) ||
            req.url.match(CFG) ||
            req.url.match(EFB) ||
            req.url.match(EBF) ||
            req.url.match(SSE_OPEN)
        );
        return res;
    }

    async function getFromCacheOrFetchAndCache(event) {
        try {
            const cache = await self.caches.open(CACHE_STATIC);
            const cachedResponse = await cache.match(event.request);
            if (cachedResponse) return cachedResponse;
            // wait until resource will be fetched from server and stored in cache
            const resp = await fetch(event.request);
            await cache.put(event.request, resp.clone());
            return resp;
        } catch (e) {
            _log(`[TeqFw_Web_Sw_Worker] error: ${JSON.stringify(e)}`);
        }
    }

    // MAIN
    const bypass = detectBypass(event.request);
    if (bypass === false)
        if (_cacheDisabled !== true)
            event.respondWith(getFromCacheOrFetchAndCache(event));
}

/**
 * Load list of files required for offline running from server and cache all files.
 * @param {ExtendableEvent} event
 */
function onInstall(event) {
    // FUNCS

    /**
     * Load zipped sources from the back and place it to the cache.
     * @return {Promise<void>}
     * @deprecated use `@teqfw/web/web/js/sw/cache-front.mjs`
     */
    async function loadZipToCache() {
        // FUNCS
        /**
         * Handmade function for the most used types.
         * @param {string} name
         * @return {string}
         */
        function getMimeByName(name) {
            const pos = name.lastIndexOf('.');
            const ext = name.substring(pos + 1).toLowerCase().trim();
            if ((ext === 'js') || (ext === 'mjs')) return 'application/javascript';
            else if (ext === 'css') return 'text/css';
            else if (ext === 'ico') return 'image/x-icon';
            else if (ext === 'md') return 'text/markdown';
            else if (ext === 'mp3') return 'audio/mpeg';
            else if (ext === 'webmanifest') return 'application/manifest+json';
            else if (ext === 'woff2') return 'font/woff2';
            else if ((ext === 'gif') || (ext === 'png')) return `image/${ext}`;
            else if ((ext === 'htm') || (ext === 'html')) return 'text/html';
            else if ((ext === 'jpeg') || (ext === 'jpg') || (ext === 'jpe')) return 'image/jpg';
            else return 'unknown';
        }

        // MAIN
        // get the first client for the service worker
        const [firstClient] = await self.clients.matchAll({includeUncontrolled: true});
        const door = (_door) ?? ''; // TODO: should we ever use the `door` concept?
        const zip = await unzip(`${URL_CFG_SW_CACHE}/${door}`);
        const entries = zip?.entries;
        if (entries) {
            const cacheStat = await caches.open(CACHE_STATIC);
            let processed = 0;
            const keys = Object.keys(entries);
            const total = keys.length;
            _log(`Total sources in the zip: ${keys.length}.`);
            for (const za of Object.values(entries)) {
                const url = za.name;
                const type = getMimeByName(url);
                if (type === 'unknown') _log(url);
                /** @type {Blob} */
                const blob = await za.blob(type);
                const headers = new Headers();
                headers.set('Content-Length', `${blob.size}`);
                headers.set('Content-Type', type);
                const resp = new Response(blob, {status: 200, headers});
                await cacheStat.put(url, resp);
                const progress = Math.round(processed++ / total * 100) / 100;
                firstClient.postMessage({type: MSG.PROGRESS, progress});
            }
        }
    }

    // MAIN
    event.waitUntil(loadZipToCache());
}

/**
 * @param {MessageEvent} event
 */
async function onMessage(event) {

    // FUNCS

    async function cacheClean() {
        try {
            const cache = await self.caches.open(CACHE_STATIC);
            const keys = await cache.keys();
            keys.forEach((one) => cache.delete(one));
        } catch (e) {
            _log(`[TeqFw_Web_Sw_Worker] error: ${JSON.stringify(e)}`);
        }
    }

    // MAIN

    /** @type {TeqFw_Web_Front_Mod_Sw_Control.Message} */
    const data = event.data;
    const type = data.type;
    const payload = data.payload;
    let out;
    // perform requested operation
    if (type === CFG_MSG.CACHE_STATUS_GET) {
        _cacheDisabled = await _config.get(CFG_CACHE_DISABLED);
        out = !_cacheDisabled; // inversion for cache status
    } else if (type === CFG_MSG.CACHE_STATUS_SET) {
        _cacheDisabled = !payload; // inversion for cache status
        await _config.set(CFG_CACHE_DISABLED, _cacheDisabled);
    } else if (type === CFG_MSG.CACHE_CLEAN) {
        await cacheClean();
    }
    // ... then return result
    const res = Object.assign({}, data);
    res.payload = out;
    // noinspection JSCheckFunctionSignatures
    event.source.postMessage(res);
}

/**
 * Setup function to populate Service Worker global scope.
 * @param {string} [door]
 * @param {function(msg:string, meta:Object=)} [log]
 */
function setup({door, log}) {
    const res = {};
    _log = log;
    _door = door;
    _config.get(CFG_CACHE_DISABLED).then((val) => _cacheDisabled = val);
    res[EVT.ACTIVATE] = onActivate;
    res[EVT.FETCH] = onFetch;
    res[EVT.INSTALL] = onInstall;
    res[EVT.MESSAGE] = onMessage;
    return res;
}

// MODULE'S MAIN
// Object.defineProperty(setup, 'namespace', {value: NS});
export {
    setup as default,
    MSG
}
