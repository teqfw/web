/**
 * Reverse stream for events (back to front) is opened.
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Shared_Event_Back_Stream_Reverse_Opened';

// MODULE'S CLASSES
/**
 * @memberOf TeqFw_Web_Shared_Event_Back_Stream_Reverse_Opened
 */
class Dto {
    static name = `${NS}.Dto`;
    /** @type {string} */
    backUUID;
    /** @type {string} */
    frontUUID;
    /** @type {string} */
    streamUUID;
}

/**
 * @implements TeqFw_Core_Shared_Api_IEvent
 */
export default class TeqFw_Web_Shared_Event_Back_Stream_Reverse_Opened {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];

        // DEFINE INSTANCE METHODS

        /**
         * @param {TeqFw_Web_Shared_Event_Back_Stream_Reverse_Opened.Dto} [data]
         * @return {TeqFw_Web_Shared_Event_Back_Stream_Reverse_Opened.Dto}
         */
        this.createDto = function (data) {
            const res = new Dto();
            res.backUUID = castString(data?.backUUID);
            res.frontUUID = castString(data?.frontUUID);
            res.streamUUID = castString(data?.streamUUID);
            return res;
        }

        this.getName = () => NS;
    }
}
