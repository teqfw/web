/**
 * Model encapsulates front application's identity (UUID & asymmetric keys).
 * Generate identity (UUID & asymmetric key) and send public parts (UUID & public key) to the server.
 */
export default class TeqFw_Web_Front_Mod_App_Front_Identity {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Web_Front_Defaults} */
        const DEF = spec['TeqFw_Web_Front_Defaults$'];
        /** @type {TeqFw_Web_Front_Mod_Store_Singleton} */
        const storeSingleton = spec['TeqFw_Web_Front_Mod_Store_Singleton$'];
        /** @type {TeqFw_Web_Front_Lib_Uuid.v4|function} */
        const uuidV4 = spec['TeqFw_Web_Front_Lib_Uuid.v4'];
        /** @type {TeqFw_Web_Front_Dto_App_Identity_Front} */
        const dtoIdentity = spec['TeqFw_Web_Front_Dto_App_Identity_Front$'];
        /** @type {TeqFw_Web_Shared_Api_Crypto_Key_IManager} */
        const mgrKeys = spec['TeqFw_Web_Shared_Api_Crypto_Key_IManager$'];
        /** @type {TeqFw_Web_Front_App_Connect_WAPI} */
        const wapi = spec['TeqFw_Web_Front_App_Connect_WAPI$'];
        /** @type {TeqFw_Web_Shared_WAPI_Front_Register.Factory} */
        const wapiRegister = spec['TeqFw_Web_Shared_WAPI_Front_Register.Factory$'];

        // VARS
        const KEY_IDENTITY = `${DEF.SHARED.NAME}/front/identity`;
        /** @type {TeqFw_Web_Front_Dto_App_Identity_Front.Dto} */
        let _cache;

        // FUNCS
        async function sendToBack(uuid, publicKey) {
            const req = wapiRegister.createReq();
            req.publicKey = publicKey;
            req.uuid = uuid;
            /** @type {TeqFw_Web_Shared_WAPI_Front_Register.Response} */
            const res = await wapi.send(req, wapiRegister);
            return res?.frontId;
        }

        // INSTANCE METHODS
        /**
         * Generate new identity and register it on backend.
         * @return {Promise<void>}
         */
        this.init = async function () {
            /** @type {TeqFw_Web_Front_Dto_App_Identity_Front.Dto} */
            const found = await storeSingleton.get(KEY_IDENTITY);
            if (found) _cache = found;
            else {
                // this is first run, create identity and send it to the back
                const dto = dtoIdentity.createDto();
                dto.uuid = uuidV4();
                dto.keys = await mgrKeys.generateAsyncKeys();
                const frontId = await sendToBack(dto.uuid, dto.keys.public);
                if (frontId) {
                    dto.frontId = frontId;
                    await storeSingleton.set(KEY_IDENTITY, dto);
                    _cache = dto;
                } else {
                    throw new Error('Fatal error. Cannot register new front app on the back.');
                }
            }
        }

        /**
         * Register current identity on backend.
         * @return {Promise<void>}
         */
        this.registerOnBack = async function () {
            /** @type {TeqFw_Web_Front_Dto_App_Identity_Front.Dto} */
            const found = await storeSingleton.get(KEY_IDENTITY);
            if (found) {
                const frontId = await sendToBack(found.uuid, found.keys.public);
                if (frontId) {
                    found.frontId = frontId;
                    await storeSingleton.set(KEY_IDENTITY, found);
                    _cache = found;
                } else throw new Error('Fatal error. Cannot register new front app on the back.');
            } else throw new Error('Fatal error. Cannot get front identity from IDB.');
        }

        /**
         * @return {TeqFw_Web_Front_Dto_App_Identity_Front.Dto}
         */
        this.get = () => _cache;
        /**
         * Front ID from backend RDB.
         * @return {number}
         */
        this.getFrontId = () => _cache?.frontId;

        /**
         * Front's public key for asymmetric encryption.
         * @type {string}
         */
        this.getPublicKey = () => _cache?.keys?.public;

        /**
         * Front's secret key for asymmetric encryption.
         * @type {string}
         */
        this.getSecretKey = () => _cache?.keys?.secret;
        /**
         * @return {string}
         */
        this.getUuid = () => _cache?.uuid;

    }
}
