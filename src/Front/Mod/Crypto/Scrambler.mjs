/**
 * Frontend implementation for scrambler (encrypt/decrypt object for strings).
 *
 * @namespace TeqFw_Web_Front_Mod_Crypto_Scrambler
 * @implements TeqFw_Web_Shared_Api_Crypto_IScrambler
 */
export default class TeqFw_Web_Front_Mod_Crypto_Scrambler {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Web_Front_Lib_Nacl.box} */
        const box = spec['TeqFw_Web_Front_Lib_Nacl.box'];
        /** @type {TeqFw_Web_Front_Lib_Nacl.randomBytes|function} */
        const randomBytes = spec['TeqFw_Web_Front_Lib_Nacl.randomBytes'];
        /** @type {TeqFw_Web_Front_Lib_Nacl_Util.decodeBase64|function} */
        const decodeBase64 = spec['TeqFw_Web_Front_Lib_Nacl_Util.decodeBase64'];
        /** @type {TeqFw_Web_Front_Lib_Nacl_Util.encodeBase64|function} */
        const encodeBase64 = spec['TeqFw_Web_Front_Lib_Nacl_Util.encodeBase64'];
        /** @type {TeqFw_Web_Front_Lib_Nacl_Util.decodeUTF8|function} */
        const decodeUTF8 = spec['TeqFw_Web_Front_Lib_Nacl_Util.decodeUTF8'];
        /** @type {TeqFw_Web_Front_Lib_Nacl_Util.encodeUTF8|function} */
        const encodeUTF8 = spec['TeqFw_Web_Front_Lib_Nacl_Util.encodeUTF8'];

        // ENCLOSED VARS
        let _keyShared;

        // MAIN

        // ENCLOSED FUNCTIONS

        // INSTANCE METHODS
        this.decryptAndVerify = function (encrypted) {
            let res = null;
            const messageWithNonceAsUint8Array = decodeBase64(encrypted);
            const nonce = messageWithNonceAsUint8Array.slice(0, box.nonceLength);
            const message = messageWithNonceAsUint8Array.slice(
                box.nonceLength,
                encrypted.length
            );
            const decryptedAb = box.open.after(message, nonce, _keyShared);
            if (decryptedAb) {
                const jsonStr = encodeUTF8(decryptedAb);
                res = JSON.parse(jsonStr);
            }
            return res;
        }

        this.encryptAndSign = function (plain) {
            const messageUint8 = decodeUTF8(JSON.stringify(plain));
            const nonce = randomBytes(box.nonceLength);
            const encrypted = box.after(messageUint8, nonce, _keyShared);
            const fullMessage = new Uint8Array(nonce.length + encrypted.length);
            fullMessage.set(nonce);
            fullMessage.set(encrypted, nonce.length);
            return encodeBase64(fullMessage);
        }

        this.setKeys = function (pub, sec) {
            const abPub = decodeBase64(pub);
            const abSec = decodeBase64(sec);
            _keyShared = box.before(abPub, abSec);
        }
    }
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_IAsync
 * @memberOf TeqFw_Web_Front_Mod_Crypto_Scrambler
 */
export class Factory {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Di_Shared_Container} */
        const container = spec['TeqFw_Di_Shared_Container$'];

        // INSTANCE METHODS
        /**
         *
         * @param [opts]
         * @return {Promise<TeqFw_Web_Front_Mod_Crypto_Scrambler>}
         */
        this.create = async function (opts) {
            // return new instance
            return container.get('TeqFw_Web_Front_Mod_Crypto_Scrambler$$');
        }
    }
}
