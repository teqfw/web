/**
 * Utilities related to HTTP2 server.
 * @namespace TeqFw_Web_Back_Util
 */

/**
 * Compose expired HTTP cookie to remove existing cookie with the same name in the browser.
 *
 * @param {string} name
 * @param {string} path
 * @returns {string}
 * @memberOf TeqFw_Web_Back_Util
 */
function cookieClear({name, path = '/'}) {
    // MAIN FUNCTIONALITY
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
 * @memberOf TeqFw_Web_Back_Util
 */
function cookieCreate({name, value, path, expires, domain, secure, httpOnly, sameSite}) {
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

// finalize code components for this es6-module
Object.defineProperty(cookieClear, 'name', {value: `${NS}.${cookieClear.name}`});
Object.defineProperty(cookieCreate, 'name', {value: `${NS}.${cookieCreate.name}`});

export {
    cookieClear,
    cookieCreate
};
