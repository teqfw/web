/**
 * Model encapsulates back application's identity (UUID & public keys).
 * Identity is initialized on front authentication when SSE connection is opening and saves data to IDB.
 */
export default class TeqFw_Web_Front_Mod_App_Back_Identity {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Web_Front_Defaults} */
        const DEF = spec['TeqFw_Web_Front_Defaults$'];
        /** @type {TeqFw_Web_Front_Mod_Store_Singleton} */
        const storeSingleton = spec['TeqFw_Web_Front_Mod_Store_Singleton$'];
        /** @type {TeqFw_Web_Front_Dto_App_Identity_Back} */
        const dtoIdentity = spec['TeqFw_Web_Front_Dto_App_Identity_Back$'];

        // VARS
        const KEY_IDENTITY = `${DEF.SHARED.NAME}/back/identity`;
        /** @type {TeqFw_Web_Front_Dto_App_Identity_Back.Dto} */
        let _cache;

        // INSTANCE METHODS

        this.init = async function () {
            /** @type {TeqFw_Web_Front_Dto_App_Identity_Back.Dto} */
            const found = await storeSingleton.get(KEY_IDENTITY);
            if (found) _cache = found;
        }

        /**
         * @param {string} backUUID
         * @param {string} serverKey
         */
        this.set = async function (backUUID, serverKey) {
            const dto = dtoIdentity.createDto();
            dto.uuid = backUUID;
            dto.publicKey = serverKey;
            await storeSingleton.set(KEY_IDENTITY, dto);
            _cache = dto;
        }

        /**
         * @return {string}
         */
        this.getUUID = () => _cache?.uuid;

        /**
         * @return {string}
         */
        this.getServerKey = () => _cache?.publicKey;
    }
}
