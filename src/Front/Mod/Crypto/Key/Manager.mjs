/**
 * Key manager to generate keys, import/export keys, etc.
 * @namespace TeqFw_Web_Front_Mod_Crypto_Key_Manager
 */

/**
 * @implements TeqFw_Web_Shared_Api_Crypto_Key_IManager
 */
export default class TeqFw_Web_Front_Mod_Crypto_Key_Manager {
    constructor(spec) {
        // DEPS
        const {box, secretbox, randomBytes} = spec['TeqFw_Web_Front_Lib_Nacl'];
        const {encodeBase64} = spec['TeqFw_Web_Front_Lib_Nacl_Util'];
        /** @type {TeqFw_Web_Shared_Dto_Identity_Keys} */
        const dtoKeys = spec['TeqFw_Web_Shared_Dto_Identity_Keys$'];

        // INSTANCE METHODS

        this.generateAsyncKeys = async function () {
            const res = dtoKeys.createDto();
            const keysBuf = box.keyPair();
            res.secret = encodeBase64(keysBuf.secretKey);
            res.public = encodeBase64(keysBuf.publicKey);
            return res;
        }

        this.generateSecretKey = async function () {
            return encodeBase64(randomBytes(secretbox.keyLength));
        }
    }
}
