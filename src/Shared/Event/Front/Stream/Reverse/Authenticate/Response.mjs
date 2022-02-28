/**
 * Frontend response to back with encrypted payload for authentication.
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Shared_Event_Front_Stream_Reverse_Authenticate_Response';

// MODULE'S CLASSES
/**
 * @memberOf TeqFw_Web_Shared_Event_Front_Stream_Reverse_Authenticate_Response
 */
class Dto {
    static namespace = NS;
    /** @type {string} */
    encrypted;
    /** @type {number} */
    frontId;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto_IEvent
 */
export default class TeqFw_Web_Shared_Event_Front_Stream_Reverse_Authenticate_Response {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Web_Shared_App_Event_Trans_Message} */
        const dtoBase = spec['TeqFw_Web_Shared_App_Event_Trans_Message$'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castInt|function} */
        const castInt = spec['TeqFw_Core_Shared_Util_Cast.castInt'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];
        /** @type {TeqFw_Core_Shared_Util_Date.addMinutes|function} */
        const addMinutes = spec['TeqFw_Core_Shared_Util_Date.addMinutes'];

        // VARS
        const ATTR = dtoBase.getAttributes();

        // FUNCS
        /**
         * @param {TeqFw_Web_Shared_Event_Front_Stream_Reverse_Authenticate_Response.Dto} [data]
         * @return {TeqFw_Web_Shared_Event_Front_Stream_Reverse_Authenticate_Response.Dto}
         */
        function createData(data) {
            const res = new Dto();
            res.encrypted = castString(data?.encrypted);
            res.frontId = castInt(data?.frontId);
            return res;
        }

        // INSTANCE METHODS
        /**
         * @param {{data: TeqFw_Web_Shared_Event_Front_Stream_Reverse_Authenticate_Response.Dto, meta: TeqFw_Web_Shared_App_Event_Trans_Message_Meta.Dto}} [data]
         * @return {{data: TeqFw_Web_Shared_Event_Front_Stream_Reverse_Authenticate_Response.Dto, meta: TeqFw_Web_Shared_App_Event_Trans_Message_Meta.Dto}}
         */
        this.createDto = function (data) {
            const res = dtoBase.createDto({[ATTR.META]: data?.[ATTR.META]});
            res.meta.name = NS;
            res.meta.expiration = addMinutes(1); // default TTL is 1 min
            res.data = createData(data?.[ATTR.DATA]);
            // noinspection JSValidateTypes
            return res;
        }

        this.getEventName = () => NS;
    }
}
