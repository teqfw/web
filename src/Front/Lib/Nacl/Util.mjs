/**
 * These functions are cloned from 'tweetnacl-util' npm-package and made es6 compatible.
 *
 * Original authors: written in 2014-2016 by Dmitry Chestnykh and Devi Mandiri.
 *
 * @namespace TeqFw_Web_Front_Lib_Nacl_Util
 */

/**
 * @param {string} s
 * @return {Uint8Array}
 * @memberOf TeqFw_Web_Front_Lib_Nacl_Util
 */
function decodeBase64(s) {
    validateBase64(s);
    let i, d = atob(s), b = new Uint8Array(d.length);
    for (i = 0; i < d.length; i++) b[i] = d.charCodeAt(i);
    return b;
}

/**
 * @param {string} s
 * @return {Uint8Array}
 * @memberOf TeqFw_Web_Front_Lib_Nacl_Util
 */
function decodeUTF8(s) {
    if (typeof s !== 'string') throw new TypeError('expected string');
    let i, d = unescape(encodeURIComponent(s)), b = new Uint8Array(d.length);
    for (i = 0; i < d.length; i++) b[i] = d.charCodeAt(i);
    return b;
}

/**
 * @param arr
 * @return {string}
 * @memberOf TeqFw_Web_Front_Lib_Nacl_Util
 */
function encodeBase64(arr) {
    let i, s = [], len = arr.length;
    for (i = 0; i < len; i++) s.push(String.fromCharCode(arr[i]));
    return btoa(s.join(''));
}

/**
 * @param arr
 * @return {string}
 * @memberOf TeqFw_Web_Front_Lib_Nacl_Util
 */
function encodeUTF8(arr) {
    let i, s = [];
    for (i = 0; i < arr.length; i++) s.push(String.fromCharCode(arr[i]));
    return decodeURIComponent(escape(s.join('')));
}

/**
 * @param s
 * @memberOf TeqFw_Web_Front_Lib_Nacl_Util
 */
function validateBase64(s) {
    if (!(/^(?:[A-Za-z0-9+\/]{2}[A-Za-z0-9+\/]{2})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)?$/.test(s))) {
        throw new TypeError('invalid encoding');
    }
}

export {
    decodeBase64,
    decodeUTF8,
    encodeBase64,
    encodeUTF8,
    validateBase64,
}
