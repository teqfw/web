/**
 * Back application identity.
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Front_Dto_App_Identity_Back';

/**
 * @memberOf TeqFw_Web_Front_Dto_App_Identity_Back
 * @type {Object}
 */
const ATTR = {
    PUBLIC_KEY: 'publicKey',
    UUID: 'uuid',
};

// MODULE'S CLASSES
/**
 * @memberOf TeqFw_Web_Front_Dto_App_Identity_Back
 */
class Dto {
    static namespace = NS;
    /**
     * Server's public key for asymmetric encryption.
     * @type {string}
     */
    publicKey;
    /** @type {string} */
    uuid;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto_IMeta
 */
export default class TeqFw_Web_Front_Dto_App_Identity_Back {

    constructor(spec) {
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];

        // INSTANCE METHODS
        /**
         * @param {TeqFw_Web_Front_Dto_App_Identity_Back.Dto} data
         * @return {TeqFw_Web_Front_Dto_App_Identity_Back.Dto}
         */
        this.createDto = function (data = null) {
            const res = new Dto();
            res.publicKey = castString(data?.publicKey);
            res.uuid = castString(data?.uuid);
            return res;
        }

        this.getAttributes = () => ATTR;

        this.getAttrNames = () => Object.values(ATTR);
    }

}

// finalize code components for this es6-module
Object.freeze(ATTR);
