/**
 * Backend implementation for scrambler (encrypt/decrypt object for strings).
 *
 * @namespace TeqFw_Web_Back_Mod_Crypto_Scrambler
 */
// MODULE'S IMPORT
import nacl from 'tweetnacl'; // as CommonJS module
import util from 'tweetnacl-util'; // as CommonJS module

// MODULE'S VARS
const NS = 'TeqFw_Web_Back_Mod_Crypto_Scrambler';

// MODULE'S CLASSES
/**
 * @implements TeqFw_Web_Shared_Api_Crypto_IScrambler
 */
export default class TeqFw_Web_Back_Mod_Crypto_Scrambler {
    constructor(spec) {
        // EXTRACT DEPS

        // ENCLOSED VARS
        let _keyShared;

        // MAIN

        // ENCLOSED FUNCTIONS

        // INSTANCE METHODS

        this.decryptAndVerify = function (encrypted) {
            let res = null;
            const messageWithNonceAsUint8Array = util.decodeBase64(encrypted);
            const nonce = messageWithNonceAsUint8Array.slice(0, nacl.box.nonceLength);
            const message = messageWithNonceAsUint8Array.slice(
                nacl.box.nonceLength,
                encrypted.length
            );
            const decryptedAb = nacl.box.open.after(message, nonce, _keyShared);
            if (decryptedAb) {
                const jsonStr = util.encodeUTF8(decryptedAb);
                res = JSON.parse(jsonStr);
            }
            return res;
        }

        this.encryptAndSign = function (plain) {
            const messageUint8 = util.decodeUTF8(JSON.stringify(plain));
            const nonce = nacl.randomBytes(box.nonceLength);
            const encrypted = nacl.box.after(messageUint8, nonce, _keyShared);
            const fullMessage = new Uint8Array(nonce.length + encrypted.length);
            fullMessage.set(nonce);
            fullMessage.set(encrypted, nonce.length);
            return util.encodeBase64(fullMessage);
        }

        this.setKeys = function (pub, sec) {
            const abPub = util.decodeBase64(pub);
            const abSec = util.decodeBase64(sec);
            _keyShared = nacl.box.before(abPub, abSec);
        }
    }
}
