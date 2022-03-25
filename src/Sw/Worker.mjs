/**
 * Main script to use service worker in TeqFW applications.
 *
 * This is standard ES6 module w/o TeqFW DI support (service workers don't allow dynamic `import()`).
 *
 * I suppose that SW files should be cached by browser itself, so these files are not under `./Front/` folder.
 * @namespace TeqFw_Web_Sw_Worker
 */
// MODULE'S IMPORT
import Config from './Config.mjs';
import MSG from '../Front/Mod/Sw/Enum/Message.mjs';

// MODULE'S VARS
const NS = 'TeqFw_Web_Sw_Worker';
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
const CACHE_STATIC = 'static-cache-v1'; // store name to cache static resources
const CFG_CACHE_DISABLED = 'cache_disabled';

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
 * @type {function}
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

function onFetch(event) {
    // FUNCS
    /**
     * Analyze route's URL and return 'true' if request should not be cached.
     * @param {Request} req
     * @returns {boolean}
     */
    function detectBypass(req) {
        // see TeqFw_Web_Shared_Defaults.SPACE_...
        const API = /(.*)(\/api\/)(.*)/;
        const EBF = /(.*)(\/ebf\/)(.*)/; // events 'back-to-front'
        const EFB = /(.*)(\/efb\/)(.*)/; // events 'front-to-back'
        return (
            req.method === 'POST' ||
            req.url.match(API) ||
            req.url.match(EFB) ||
            req.url.match(EBF)
        );
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

function onInstall(event) {
    // FUNCS

    /**
     * Load list of static file's URLs to cache locally.
     * @return {Promise<string[]>}
     */
    async function loadFilesToCache() {
        // Get list of static files from the server
        const data = {door: _door}; // see TeqFw_Web_Shared_WAPI_Load_FilesToCache.Request
        const req = new Request(API_STATIC_FILES, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({data})
        });
        const resp = await self.fetch(req);
        const json = await resp.json();
        const res = json?.data?.items ?? [];
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
                // ... and load static files to the local cache
                const cacheStat = await caches.open(CACHE_STATIC);
                // METHOD 1
                // await cacheStat.addAll(files);
                // METHOD 2
                let total = 0;
                const SIZE = 10;
                while (total <= urls.length) {
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

                }
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
    if (type === MSG.CACHE_STATUS_GET) {
        _cacheDisabled = await _config.get(CFG_CACHE_DISABLED);
        out = !_cacheDisabled; // inversion for cache status
    } else if (type === MSG.CACHE_STATUS_SET) {
        _cacheDisabled = !payload; // inversion for cache status
        await _config.set(CFG_CACHE_DISABLED, _cacheDisabled);
    } else if (type === MSG.CACHE_CLEAN) {
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
            /** @type {TeqFw_Web_Shared_WAPI_Front_Log_Collect.Request} */
            const req = {item};
            fetch('./api/@teqfw/web/front/log/collect', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({data: req}),
            });
        }
    }
}

/**
 * Setup function to populate Service Worker global scope.
 * @param {WorkerGlobalScope} scope
 * @param {string} [door]
 * @param {function(string):function} logFactory
 */
function setup({scope, door, logFactory}) {
    _log = logFactory(NS); // create log function for this es6-module
    _door = door;
    _config.get(CFG_CACHE_DISABLED).then((val) => _cacheDisabled = val);
    scope.addEventListener(EVT.ACTIVATE, onActivate);
    scope.addEventListener(EVT.FETCH, onFetch);
    scope.addEventListener(EVT.INSTALL, onInstall);
    scope.addEventListener(EVT.MESSAGE, onMessage);
    const entryPoint = _door ? 'root entry point' : `'${_door}' entry point`;
    _log(`Event listeners are registered for ${entryPoint}.`);
}

// MODULE'S MAIN
// Object.defineProperty(setup, 'namespace', {value: NS});
export {
    createLogger,
    setup
}
