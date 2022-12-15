/**
 * Frontend implementation of TeqFw_Core_Shared_Api_Util_ICrypto.
 *
 * @namespace TeqFw_Web_Front_Util_Crypto
 */
// MODULE'S IMPORT
const NS = 'TeqFw_Web_Front_Util_Crypto';

function randomUUID() {
    return self.crypto.randomUUID();
}

// MAIN
Object.defineProperty(randomUUID, 'namespace', {value: NS});

export {
    randomUUID,
}
