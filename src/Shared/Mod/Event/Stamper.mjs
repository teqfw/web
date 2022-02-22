/**
 * Create & verify stamps for event messages between a pair of addressees (front & back).
 */
export default class TeqFw_Web_Shared_Mod_Event_Stamper {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Util_Cast.castDate|function} */
        const castDate = spec['TeqFw_Core_Shared_Util_Cast.castDate'];
        /** @type {TeqFw_Web_Shared_Api_Crypto_IScrambler} */
        const scrambler = spec['TeqFw_Web_Shared_Api_Crypto_IScrambler$$']; // instance

        // VARS
        let _isInitialized = false;

        // VARS
        /**
         * @param {TeqFw_Web_Shared_App_Event_Trans_Message_Meta.Dto} meta event message metadata
         * @return {string} payoad to encrypt/verify
         */
        function composePayload(meta) {
            /** @type {Date} */
            const published = castDate(meta.published);
            return `${meta.uuid}${published.getTime()}`;
        }

        // INSTANCE METHODS
        /**
         * Initialize scrambler's keys if not initialized yet.
         * @param {string} pub
         * @param {string} sec
         */
        this.initKeys = (pub, sec) => {
            if (!_isInitialized) {
                scrambler.setKeys(pub, sec);
                _isInitialized = true;
            }
        }

        /**
         * Concatenate data for encryption and encrypt it.
         * @param {TeqFw_Web_Shared_App_Event_Trans_Message_Meta.Dto} meta event message metadata
         * @return {string} stamp (encrypted data)
         */
        this.create = function (meta) {
            const plain = composePayload(meta)
            return scrambler.encryptAndSign(plain);
        }

        /**
         * Decrypt stamp and compare with expected data.
         * @param {string} stamp encrypted data
         * @param {TeqFw_Web_Shared_App_Event_Trans_Message_Meta.Dto} meta event message metadata
         * @return {boolean}
         */
        this.verify = function (stamp, meta) {
            const expect = composePayload(meta);
            const actual = scrambler.decryptAndVerify(stamp);
            return (actual === expect);
        }
    }
}
