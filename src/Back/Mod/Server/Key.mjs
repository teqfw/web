/**
 * Source to get server keys for asymmetric encryption.
 *
 * @namespace TeqFw_Web_Back_Mod_Server_Key
 */
// MODULE'S IMPORT
import {join} from "path";
import {existsSync, writeFileSync} from 'fs';

// MODULE'S CLASSES
export default class TeqFw_Web_Back_Mod_Server_Key {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Web_Back_Defaults} */
        const DEF = spec['TeqFw_Web_Back_Defaults$'];
        /** @type {TeqFw_Core_Shared_Api_ILogger} */
        const logger = spec['TeqFw_Core_Shared_Api_ILogger$'];
        /** @type {TeqFw_Core_Back_Config} */
        const config = spec['TeqFw_Core_Back_Config$'];
        /** @type {TeqFw_Core_Back_Util.readJson|function} */
        const readJson = spec['TeqFw_Core_Back_Util.readJson'];
        /** @type {TeqFw_Web_Shared_Api_Crypto_Key_IManager} */
        const mgrKey = spec['TeqFw_Web_Shared_Api_Crypto_Key_IManager$'];

        // ENCLOSED VARS
        /** @type {TeqFw_Web_Shared_Dto_Identity_Keys.Dto} */
        let _keys;

        // ENCLOSED FUNCTIONS
        /**
         * Load server's keys from the file or generate new ones.
         */
        async function init() {
            const root = config.getBoot().projectRoot;
            const path = join(root, DEF.FILE_CRYPTO_KEYS);
            if (!(existsSync(path))) {
                _keys = await mgrKey.generateAsyncKeys();
                const data = JSON.stringify(_keys);
                writeFileSync(path, data);
                logger.info(`New crypto keys are stored in '${path}'.`);
            } else {
                _keys = readJson(path);
                logger.info(`Crypto keys are loaded from '${path}'.`);
            }
        }

        // INSTANCE METHODS

        /**
         * @return {Promise<string>}
         */
        this.getPublic = async function () {
            if (!_keys) await init();
            return _keys.public;
        }

        /**
         * @return {Promise<string>}
         */
        this.getSecret = async function () {
            if (!_keys) await init();
            return _keys.secret;
        }
    }
}
