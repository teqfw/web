/**
 * Delayed events for some front app were re-published by back.
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Back_Event_Republish_Delayed';

// MODULE'S CLASSES
/**
 * @memberOf TeqFw_Web_Back_Event_Republish_Delayed
 */
class Dto {
    static namespace = NS;
    /**
     * Number of re-published events.
     * @type {number}
     */
    count;
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
export default class TeqFw_Web_Back_Event_Republish_Delayed {
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
         * @param {TeqFw_Web_Back_Event_Republish_Delayed.Dto} [data]
         * @return {TeqFw_Web_Back_Event_Republish_Delayed.Dto}
         */
        function createData(data) {
            const res = new Dto();
            res.count = castInt(data?.count);
            res.frontId = castInt(data?.frontId);
            res.frontUuid = castString(data?.frontUuid);
            return res;
        }

        // INSTANCE METHODS
        /**
         * @param {{[data]: TeqFw_Web_Back_Event_Republish_Delayed.Dto, [meta]: TeqFw_Core_Shared_App_Event_Message_Meta.Dto}} [data]
         * @return {{data: TeqFw_Web_Back_Event_Republish_Delayed.Dto, meta: TeqFw_Core_Shared_App_Event_Message_Meta.Dto}}
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
