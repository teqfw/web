import {constants as H2} from 'node:http2';

class TeqFw_Web_Back_Util_Cookie {
    /**
     * Compose expired HTTP cookie to remove existing cookie with the same name in the browser.
     *
     * @param {string} name
     * @param {string} path
     * @returns {string}
     */
    clear({name, path = '/'}) {
        const exp = 'Expires=Thu, 01 Jan 1970 00:00:00 GMT';
        return `${name}=; ${exp}; Path=${path}`;
    }

    /**
     * Construct string for 'Set-Cookie' HTTP header.
     *
     * @param {string} name
     * @param {string} value
     * @param {string} path
     * @param {Date|number|string} expires 'Expires=' for Date & String, 'Max-Age=' for integer number
     * @param {string} domain
     * @param {boolean} secure
     * @param {boolean} httpOnly
     * @param {string} sameSite [Lax | Strict | None]
     * @returns {string}
     */
    create({name, value, path, expires, domain, secure, httpOnly, sameSite}) {
        let result = `${name}=${value};`;
        if (expires) {
            if (expires instanceof Date) {
                result += ` Expires=${expires.toUTCString()};`;
            } else if (Number.isInteger(expires)) {
                result += ` Max-Age=${expires};`;
            } else if (typeof expires === 'string') {
                result += ` Expires=${expires};`;
            }
        }
        if (domain) result += ` Domain=${domain};`;
        if (path) result += ` Path=${path};`;
        if (secure !== false) result += ` Secure;`;
        if (httpOnly !== false) result += ` HttpOnly;`;
        result += ` SameSite=${sameSite || 'Strict'};`;
        return result;
    }

    /**
     * Get cookie from HTTP request.
     *
     * @param {IncomingMessage|Http2ServerRequest} request
     * @param {string} cookie cookie name
     * @returns {string|null}
     */
    get({request, cookie}) {
        const headers = request.headers;
        const cookies = headers[H2.HTTP2_HEADER_COOKIE];
        const value = cookies?.match('(^|;)\\s*' + cookie + '\\s*=\\s*([^;]+)')?.pop() || '';
        return value.length ? value : null;
    }

    /**
     * Set cookie to HTTP response.
     *
     * @param {ServerResponse|Http2ServerResponse} response
     * @param {string} cookie cookie value (like `${name}=${value};`)
     */
    set({response, cookie}) {
        const existing = response.getHeader(H2.HTTP2_HEADER_SET_COOKIE);
        let value;
        if (!existing) {
            value = cookie;
        } else if (typeof existing === 'string') {
            value = [existing, cookie];
        } else if (Array.isArray(existing)) {
            value = [...existing, cookie];
        } else {
            throw new Error(`Unexpected value for existing cookies: ${existing}`);
        }
        response.setHeader(H2.HTTP2_HEADER_SET_COOKIE, value);
    }
}

// Create an instance of the utility class
const cookieUtil = new TeqFw_Web_Back_Util_Cookie();

// Export class as default and methods as named exports
export default TeqFw_Web_Back_Util_Cookie;
export const clear = cookieUtil.clear.bind(cookieUtil);
export const create = cookieUtil.create.bind(cookieUtil);
export const get = cookieUtil.get.bind(cookieUtil);
export const set = cookieUtil.set.bind(cookieUtil);
