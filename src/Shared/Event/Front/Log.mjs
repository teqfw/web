/**
 * Logging event on a front.
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Shared_Event_Front_Log';

// MODULE'S CLASSES
/**
 * @memberOf TeqFw_Web_Shared_Event_Front_Log
 */
class Dto {
    static namespace = NS;
    /** @type {string} */
    body;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto_IEvent
 */
export default class TeqFw_Web_Shared_Event_Front_Log {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Web_Shared_App_Event_Trans_Message} */
        const dtoBase = spec['TeqFw_Web_Shared_App_Event_Trans_Message$'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];
        /** @type {TeqFw_Core_Shared_Util_Date.addMinutes|function} */
        const addMinutes = spec['TeqFw_Core_Shared_Util_Date.addMinutes'];

        // ENCLOSED VARS
        const ATTR = dtoBase.getAttributes();

        // ENCLOSED FUNCTIONS
        /**
         * @param {TeqFw_Web_Shared_Event_Front_Log.Dto} [data]
         * @return {TeqFw_Web_Shared_Event_Front_Log.Dto}
         */
        function createData(data) {
            const res = new Dto();
            res.body = castString(data?.body);
            return res;
        }

        // INSTANCE METHODS

        /**
         * @param {{data: TeqFw_Web_Shared_Event_Front_Log.Dto, meta: TeqFw_Web_Shared_App_Event_Trans_Message_Meta.Dto}} [data]
         * @return {{data: TeqFw_Web_Shared_Event_Front_Log.Dto, meta: TeqFw_Web_Shared_App_Event_Trans_Message_Meta.Dto}}
         */
        this.createDto = function (data) {
            const res = dtoBase.createDto({[ATTR.META]: data?.[ATTR.META]});
            res.meta.name = NS;
            res.meta.expiration = addMinutes(8); // expire events after 8 minutes by default
            res.data = createData(data?.[ATTR.DATA]);
            // noinspection JSValidateTypes
            return res;
        }

        this.getEventName = () => NS;
    }
}
