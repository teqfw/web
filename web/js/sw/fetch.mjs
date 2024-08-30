/**
 * Module with functions to use in a service worker during the fetch stage.
 */
// MODULE'S IMPORTS

// MODULE'S VARS

// MODULE'S FUNCS

/**
 * Function to detect URLs that always bypass caching for @teqfw/web plugin.
 * @param {Request} req
 * @return {boolean}
 */
export function bypassCache(req) {
    const CFG = /(.*)(\/cfg\/)(.*)/; // configuration (DI, front app, cache, ...)
    return Boolean((req.method === 'POST') || req.url.match(CFG));
}

/**
 *
 * @param {Request} req
 * @param {Cache} cache
 * @return {Promise<Response>}
 */
export async function getFromCacheOrFetchAndCache(req, cache) {
    const cachedResponse = await cache.match(req);
    if (cachedResponse) return cachedResponse;
    // wait until the resource is fetched from the backend and stored in the cache.
    const res = await fetch(req);
    await cache.put(req, res.clone());
    return res;
}