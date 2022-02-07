/**
 * Model encapsulates back application's identity (UUID & public keys).
 * Identity is initialized on front authentication when SSE connection is opening.
 */
export default class TeqFw_Web_Front_Mod_App_Back_Identity {
    constructor() {
        // ENCLOSED VARS
        /** @type {string} */
        let _backUUID;
        /**
         * Server's public key for asymmetric encryption.
         * @type {string}
         */
        let _serverKey;

        // INSTANCE METHODS
        /**
         * @param {string} backUUID
         * @param {string} serverKey
         */
        this.set = function (backUUID, serverKey) {
            _backUUID = backUUID;
            _serverKey = serverKey;
        }

        /**
         * @return {string}
         */
        this.getUUID = () => _backUUID;

        /**
         * @return {string}
         */
        this.getServerKey = () => _serverKey;
    }
}
