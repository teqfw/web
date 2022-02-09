/**
 * Front application identity.
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Front_Dto_App_Identity_Front';

/**
 * @memberOf TeqFw_Web_Front_Dto_App_Identity_Front
 * @type {Object}
 */
const ATTR = {
    FRONT_ID: 'frontId',
    KEYS: 'keys',
    UUID: 'uuid',
};

// MODULE'S CLASSES
/**
 * @memberOf TeqFw_Web_Front_Dto_App_Identity_Front
 */
class Dto {
    static namespace = NS;
    /**
     * Backend ID for current front (see TeqFw_Web_Back_WAPI_Front_Register)
     * @type {number}
     */
    frontId;
    /** @type {TeqFw_Web_Shared_Dto_Identity_Keys.Dto} */
    keys;
    /** @type {string} */
    uuid;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto_IMeta
 */
export default class TeqFw_Web_Front_Dto_App_Identity_Front {

    constructor(spec) {
        /** @type {TeqFw_Core_Shared_Util_Cast.castInt|function} */
        const castInt = spec['TeqFw_Core_Shared_Util_Cast.castInt'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];
        /** @type {TeqFw_Web_Shared_Dto_Identity_Keys} */
        const dtoKeys = spec['TeqFw_Web_Shared_Dto_Identity_Keys$'];

        // INSTANCE METHODS
        /**
         * @param {TeqFw_Web_Front_Dto_App_Identity_Front.Dto} data
         * @return {TeqFw_Web_Front_Dto_App_Identity_Front.Dto}
         */
        this.createDto = function (data = null) {
            const res = new Dto();
            res.frontId = castInt(data?.frontId);
            res.keys = dtoKeys.createDto(data?.keys);
            res.uuid = castString(data?.uuid);
            return res;
        }

        this.getAttributes = () => ATTR;

        this.getAttrNames = () => Object.values(ATTR);
    }

}

// finalize code components for this es6-module
Object.freeze(ATTR);
