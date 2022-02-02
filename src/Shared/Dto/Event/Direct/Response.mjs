/**
 * Server response for received front event been got through direct events stream.
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Shared_Dto_Event_Direct_Response';

/**
 * @memberOf TeqFw_Web_Shared_Dto_Event_Direct_Response
 * @type {Object}
 */
const ATTR = {
    SUCCESS: 'success',
};

// MODULE'S CLASSES
/**
 * @memberOf TeqFw_Web_Shared_Dto_Event_Direct_Response
 */
class Dto {
    static namespace = NS;
    /** @type {boolean} */
    success;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto_IMeta
 */
export default class TeqFw_Web_Shared_Dto_Event_Direct_Response {

    constructor(spec) {
        /** @type {TeqFw_Core_Shared_Util_Cast.castBoolean|function} */
        const castBoolean = spec['TeqFw_Core_Shared_Util_Cast.castBoolean'];

        // INSTANCE METHODS
        /**
         * @param {TeqFw_Web_Shared_Dto_Event_Direct_Response.Dto} data
         * @return {TeqFw_Web_Shared_Dto_Event_Direct_Response.Dto}
         */
        this.createDto = function (data = null) {
            const res = new Dto();
            res.success = castBoolean(data?.success);
            return res;
        }

        this.getAttributes = () => ATTR;

        this.getAttrNames = () => Object.values(ATTR);
    }

}

// finalize code components for this es6-module
Object.freeze(ATTR);
