/**
 * Backend implementation of crypto key manager.
 * @namespace TeqFw_Web_Back_Mod_Crypto_Key_Manager
 */
// MODULE'S IMPORT
import nacl from 'tweetnacl'; // as CommonJS module
import util from 'tweetnacl-util'; // as CommonJS module

/**
 * @implements TeqFw_Web_Shared_Api_Crypto_Key_IManager
 */
export default class TeqFw_Web_Back_Mod_Crypto_Key_Manager {

    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Web_Shared_Dto_Identity_Keys} */
        const dtoKeys = spec['TeqFw_Web_Shared_Dto_Identity_Keys$'];

        this.generateAsyncKeys = async function () {
            const res = dtoKeys.createDto();
            const keysBuf = nacl.box.keyPair();
            res.secret = util.encodeBase64(keysBuf.secretKey);
            res.public = util.encodeBase64(keysBuf.publicKey);
            return res;
        }

        this.generateSecretKey = async function () {
            return util.encodeBase64(nacl.randomBytes(nacl.secretbox.keyLength));
        }
    }
}
