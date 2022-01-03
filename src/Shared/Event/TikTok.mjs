/**
 * One tik is performed on front or back.
 *
 * @namespace TeqFw_Web_Shared_Event_TikTok
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Shared_Event_TikTok';

// MODULE'S CLASSES
/**
 * @memberOf TeqFw_Web_Shared_Event_TikTok
 */
class Dto {
    static name = `${NS}.Dto`;
}

/**
 * @implements TeqFw_Core_Shared_Api_IEvent
 */
export default class TeqFw_Web_Shared_Event_TikTok {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];

        // DEFINE INSTANCE METHODS

        /**
         * @param {TeqFw_Web_Shared_Event_TikTok.Dto} [data]
         * @return {TeqFw_Web_Shared_Event_TikTok.Dto}
         */
        this.createDto = function (data) {
            const res = new Dto();
            return res;
        }

        this.getName = () => NS;
    }
}
