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
        const modSingleton = spec['TeqFw_Web_Front_Mod_Store_Singleton$'];
        /** @type {TeqFw_Web_Front_Lib_Uuid.v4|function} */
        const uuidV4 = spec['TeqFw_Web_Front_Lib_Uuid.v4'];
        /** @type {TeqFw_Web_Front_Dto_App_Identity} */
        const dtoIdentity = spec['TeqFw_Web_Front_Dto_App_Identity$'];
        /** @type {TeqFw_Web_Shared_Api_Crypto_Key_IManager} */
        const mgrKeys = spec['TeqFw_Web_Shared_Api_Crypto_Key_IManager$'];
        /** @type {TeqFw_Web_Front_App_Connect_WAPI} */
        const wapi = spec['TeqFw_Web_Front_App_Connect_WAPI$'];
        /** @type {TeqFw_Web_Shared_WAPI_Front_Register.Factory} */
        const wapiRegister = spec['TeqFw_Web_Shared_WAPI_Front_Register.Factory$'];

        // ENCLOSED VARS
        const KEY_IDENTITY = `${DEF.SHARED.NAME}/front/identity`;
        /** @type {TeqFw_Web_Front_Dto_App_Identity.Dto} */
        let _cache;

        // INSTANCE METHODS
        this.init = async function () {
            // ENCLOSED FUNCS
            async function sendToBack(uuid, publicKey) {
                const req = wapiRegister.createReq();
                req.publicKey = publicKey;
                req.uuid = uuid;
                /** @type {TeqFw_Web_Shared_WAPI_Front_Register.Response} */
                const res = await wapi.send(req, wapiRegister);
                return res?.frontId;
            }

            // MAIN
            /** @type {TeqFw_Web_Front_Dto_App_Identity.Dto} */
            const found = await modSingleton.get(KEY_IDENTITY);
            if (found) _cache = found;
            else {
                // this is first run, create identity and send it to the back
                const dto = dtoIdentity.createDto();
                dto.uuid = uuidV4();
                dto.keys = await mgrKeys.generateAsyncKeys();
                const frontId = await sendToBack(dto.uuid, dto.keys.public);
                if (frontId) {
                    dto.frontId = frontId;
                    await modSingleton.set(KEY_IDENTITY, dto);
                    _cache = dto;
                } else {
                    throw new Error('Fatal error. Cannot register new front app on the back.');
                }
            }
        }

        /**
         * @return {TeqFw_Web_Front_Dto_App_Identity.Dto}
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
         * @return {string}
         */
        this.getUuid = () => _cache?.uuid;

    }
}
