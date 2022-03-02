/**
 * Front app is authenticated on the back.
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Back_Event_Front_Authenticated';

// MODULE'S CLASSES
/**
 * @memberOf TeqFw_Web_Back_Event_Front_Authenticated
 */
class Dto {
    static namespace = NS;
    /**
     * Front application ID in backend RDB.
     * @type {number}
     */
    frontId;
    /** @type {string} */
    frontUuid;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto_IEvent
 */
export default class TeqFw_Web_Back_Event_Front_Authenticated {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_App_Event_Message} */
        const dtoBase = spec['TeqFw_Core_Shared_App_Event_Message$'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castInt|function} */
        const castInt = spec['TeqFw_Core_Shared_Util_Cast.castInt'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];

        // VARS
        const ATTR = dtoBase.getAttributes();

        // FUNCS
        /**
         * @param {TeqFw_Web_Back_Event_Front_Authenticated.Dto} [data]
         * @return {TeqFw_Web_Back_Event_Front_Authenticated.Dto}
         */
        function createData(data) {
            const res = new Dto();
            res.frontId = castInt(data?.frontId);
            res.frontUuid = castString(data?.frontUuid);
            return res;
        }

        // INSTANCE METHODS
        /**
         * @param {{[data]: TeqFw_Web_Back_Event_Front_Authenticated.Dto, [meta]: TeqFw_Core_Shared_App_Event_Message_Meta.Dto}} [data]
         * @return {{data: TeqFw_Web_Back_Event_Front_Authenticated.Dto, meta: TeqFw_Core_Shared_App_Event_Message_Meta.Dto}}
         */
        this.createDto = (data) => {
            const res = dtoBase.createDto({[ATTR.META]: data?.[ATTR.META]});
            res.meta.name = NS;
            res.data = createData(data?.[ATTR.DATA]);
            // noinspection JSValidateTypes
            return res;
        }

        this.getEventName = () => NS;
    }
}
