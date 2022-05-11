/**
 * Frontend encoding/decoding utilities.
 *
 * @implements TeqFw_Core_Shared_Api_Util_ICodec
 */
export default class TeqFw_Web_Front_Util_Codec {
    constructor() {
        // FUNCS
        /**
         * @param {string} s
         */
        function validateBase64(s) {
            if (!(/^(?:[A-Za-z0-9+\/]{2}[A-Za-z0-9+\/]{2})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)?$/.test(s))) {
                throw new TypeError('invalid encoding');
            }
        }

        // INSTANCE METHODS

        this.ab2b64 = function (buf) {
            // see util.encodeBase64 from 'tweetnacl-util'
            const s = [], len = buf.length;
            for (let i = 0; i < len; i++) s.push(String.fromCharCode(buf[i]));
            return btoa(s.join(''));
        }

        this.ab2utf = function (buf) {
            // see util.encodeUTF8 from 'tweetnacl-util'
            const s = [];
            for (let i = 0; i < buf.length; i++) s.push(String.fromCharCode(buf[i]));
            return decodeURIComponent(escape(s.join('')));
        }

        this.b642ab = function (str) {
            // see util.decodeBase64 from 'tweetnacl-util'
            validateBase64(str);
            const d = atob(str);
            const b = new Uint8Array(d.length);
            for (let i = 0; i < d.length; i++) b[i] = d.charCodeAt(i);
            return b;
        }

        this.utf2ab = function (str) {
            // see util.decodeUTF8 from 'tweetnacl-util'
            if (typeof str !== 'string') throw new TypeError('expected string');
            const d = unescape(encodeURIComponent(str));
            const b = new Uint8Array(d.length);
            for (let i = 0; i < d.length; i++) b[i] = d.charCodeAt(i);
            return b;
        }
    }
}
