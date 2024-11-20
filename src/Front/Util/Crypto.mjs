/**
 * Frontend implementation of TeqFw_Core_Shared_Api_Util_Crypto.
 *
 * @namespace TeqFw_Web_Front_Util_Crypto
 * @deprecated I think we should use a polyfills
 */
// MODULE'S IMPORT
const NS = 'TeqFw_Web_Front_Util_Crypto';

/**
 * @memberOf TeqFw_Web_Front_Util_Crypto
 * @return {string}
 */
function randomUUID() {
    if (self.crypto && typeof self.crypto.randomUUID === 'function') {
        return self.crypto.randomUUID();
    } else {
        const template = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
        return template.replace(/[xy]/g, (c) => {
            const r = (self.crypto && self.crypto.getRandomValues)
                ? (self.crypto.getRandomValues(new Uint8Array(1))[0] & 15)
                : Math.floor(Math.random() * 16);
            const v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }
}

// MAIN
Object.defineProperty(randomUUID, 'namespace', {value: NS});

export {
    randomUUID,
};
