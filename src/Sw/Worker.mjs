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
     * Load list of static file's URLs to cache locally.
     * @return {Promise<string[]>}
     */
    async function loadFilesToCache() {
        // Get list of static files from the server
        //const data = {door: _door}; // see TeqFw_Web_Back_App_Server_Handler_Config_A_SwCache
        const req = new Request(`${URL_CFG_SW_CACHE}/${_door}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const resp = await self.fetch(req);
        const json = await resp.json();
        const res = Array.isArray(json) ? json : [];
        _log(`List of static files to cache is loaded (total items: ${res.length}).`);
        return res;
    }

    /**
     * Load urls from server and cache content locally. All URLs are separated to batches up to 10 URLs each.
     * @param {string[]} urls
     * @return {Promise<void>}
     */
    async function cacheStatics(urls) {
        try {
            if (Array.isArray(urls)) {

                const allClients = await self.clients.matchAll({
                    includeUncontrolled: true
                });
                const [firstClient] = allClients;
                let progress = 0;
                firstClient.postMessage({type: MSG.PROGRESS, progress: 0});

                // ... and load static files to the local cache
                const cacheStat = await caches.open(CACHE_STATIC);
                // METHOD 1
                // await cacheStat.addAll(files);
                // METHOD 2
                let total = 0;
                const SIZE = 10;
                while (total <= urls.length) {
                    firstClient.postMessage({type: MSG.PROGRESS, progress});
                    const slice = urls.slice(total, total + SIZE);
                    await Promise.all(
                        slice.map(function (url) {
                            return cacheStat.add(url).catch(function (reason) {
                                _log(`SW install error: '${url}' failed, ${String(reason)}`);
                            });
                        })
                    );
                    total += SIZE;
                    const cached = total < urls.length ? total : urls.length;
                    _log(`Total '${cached}' URLs are cached.`);
                    progress = Math.round(total / urls.length * 100) / 100
                }
                // report 100%
                firstClient.postMessage({type: MSG.PROGRESS, progress: 1});
            }
            _log(`Static files are loaded and cached by Service Worker.`);
        } catch (e) {
            _log(`SW iInstallation error: ${JSON.stringify(e)}`);
        }
    }

    // MAIN
    event.waitUntil(
        loadFilesToCache()
            .then(cacheStatics)
            .catch((e) => {
                _log(`[TeqFw_Web_Sw_Worker] error: ${e.message}`);
            })
    );
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
 * Create log-function to trace service worker functionality.
 *
 * @param {string} uuid frontend identifier for service worker instance.
 * @return {(function(string, Object): void)}
 */
function createLogger(uuid) {
    // FUNCS
    /**
     * Log function to send log info to the server.
     * @param {string} msg
     * @param {Object} [meta]
     */
    return function log(msg, meta = {}) {
        if (navigator.onLine) {
            /** @type {TeqFw_Core_Shared_Dto_Log.Dto} */
            const item = {
                date: new Date(),
                isError: false,
                message: msg,
                meta: {},
                source: NS,
            };
            if (typeof meta === 'object') Object.assign(item.meta, meta);
            item.meta.frontUuid = uuid;
            /** @type {TeqFw_Web_Api_Shared_WAPI_Front_Log_Collect.Request} */
            const req = {item};
            const body = JSON.stringify({data: req});
            fetch('./api/@teqfw/web/front/log/collect', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body,
            });
            console.log(body);
        }
    }
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
