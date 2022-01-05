/**
 * One 'tok' is performed on the back.
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Shared_Event_Back_Tok';

// MODULE'S CLASSES
/**
 * @memberOf TeqFw_Web_Shared_Event_Back_Tok
 */
class Dto {
    static name = `${NS}.Dto`;
    /** @type {string} */
    backUUID;
}

/**
 * @implements TeqFw_Core_Shared_Api_IEvent
 */
export default class TeqFw_Web_Shared_Event_Back_Tok {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];

        // DEFINE INSTANCE METHODS

        /**
         * @param {TeqFw_Web_Shared_Event_Back_Tok.Dto} [data]
         * @return {TeqFw_Web_Shared_Event_Back_Tok.Dto}
         */
        this.createDto = function (data) {
            const res = new Dto();
            res.backUUID = castString(data?.backUUID);
            return res;
        }

        this.getName = () => NS;
    }
}
