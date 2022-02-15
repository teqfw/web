/**
 * One 'tik' is performed on the front.
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Shared_Event_Front_Tik';

// MODULE'S CLASSES
/**
 * @memberOf TeqFw_Web_Shared_Event_Front_Tik
 */
class Dto {
    static namespace = NS;
    frontUUID;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto_IEvent
 */
export default class TeqFw_Web_Shared_Event_Front_Tik {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];

        // DEFINE INSTANCE METHODS

        /**
         * @param {TeqFw_Web_Shared_Event_Front_Tik.Dto} [data]
         * @return {TeqFw_Web_Shared_Event_Front_Tik.Dto}
         */
        this.createDto = function (data) {
            const res = new Dto();
            res.frontUUID = castString(data?.frontUUID);
            return res;
        }

        this.getEventName = () => NS;
    }
}
