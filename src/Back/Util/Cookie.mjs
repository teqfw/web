/**
 * Utilities related to the web server.
 * @namespace TeqFw_Web_Back_Util_Cookie
 */
// MODULE'S IMPORTS
import {constants as H2} from 'node:http2';

// MODULE'S VARS
const NS = 'TeqFw_Web_Back_Util_Cookie';

// MODULE'S FUNCS
/**
 * Compose expired HTTP cookie to remove existing cookie with the same name in the browser.
 *
 * @param {string} name
 * @param {string} path
 * @returns {string}
 * @memberOf TeqFw_Web_Back_Util_Cookie
 */
function clear({name, path = '/'}) {
    // MAIN
    const exp = 'Expires=Thu, 01 Jan 1970 00:00:00 GMT';
    return `${name}=; ${exp}; Path=${path}`;
}

/**
 * Construct string for 'Set-Cookie' HTTP header.
 *
 * @param {string} name
 * @param {string} value
 * @param {string} path
 * @param {Date|number|String} expires 'Expires=' for Date & String, 'Max-Age=' for integer number
 * @param {string} domain
 * @param {boolean} secure
 * @param {boolean} httpOnly
 * @param {string} sameSite [Lax | Strict | None] @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite
 * @returns {string}
 * @memberOf TeqFw_Web_Back_Util_Cookie
 */
function create({name, value, path, expires, domain, secure, httpOnly, sameSite}) {
    let result = `${name}=${value};`;
    if (expires) {
        if (expires instanceof Date) {
            result = `${result} Expires=${expires.toUTCString()};`;
        } else if (Number.isInteger(expires)) {
            result = `${result} Max-Age=${expires};`;
        } else if (typeof expires === 'string') {
            result = `${result} Expires=${expires};`;
        }
    }
    if (domain) result = `${result} Domain=${domain};`;
    if (path) result = `${result} Path=${path};`;
    if (secure !== false) result = `${result} Secure;`; // always secure except implicit notation
    if (httpOnly !== false) result = `${result} HttpOnly;`; // always http only except implicit notation
    if (sameSite) {
        result = `${result} SameSite=${sameSite};`;
    } else {
        result = `${result} SameSite=Strict;`;
    }
    return result;
}

/**
 * Get cookie from HTTP request.
 * @param {IncomingMessage|Http2ServerRequest} request
 * @param {string} cookie cookie name
 * @returns {string|null}
 * @memberOf TeqFw_Web_Back_Util_Cookie
 */
function get({request, cookie}) {
    const headers = request.headers;
    const cookies = headers[H2.HTTP2_HEADER_COOKIE];
    const value = cookies?.match('(^|;)\\s*' + cookie + '\\s*=\\s*([^;]+)')?.pop() || '';
    if (value.length) {
        // there is session cookie in HTTP request
        return value;
    }
    return null;
}

/**
 * Set cookie to HTTP response.
 * @param {ServerResponse|Http2ServerResponse} response
 * @param {string} cookie cookie value (like `${name}=${value};`)
 * @memberOf TeqFw_Web_Back_Util_Cookie
 */
function set({response, cookie}) {
    const cookies = response.getHeader(H2.HTTP2_HEADER_SET_COOKIE);
    const value = (cookies) ? `${cookies}${cookie}` : cookie;
    response.setHeader(H2.HTTP2_HEADER_SET_COOKIE, value);
}

// finalize code components for this es6-module
Object.defineProperty(clear, 'namespace', {value: NS});
Object.defineProperty(create, 'namespace', {value: NS});
Object.defineProperty(get, 'namespace', {value: NS});
Object.defineProperty(set, 'namespace', {value: NS});

export {
    clear,
    create,
    get,
    set,
};
