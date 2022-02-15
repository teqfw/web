/**
 * Backend request to front with payload for authentication.
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Shared_Event_Back_Stream_Reverse_Authenticate_Request';

// MODULE'S CLASSES
/**
 * @memberOf TeqFw_Web_Shared_Event_Back_Stream_Reverse_Authenticate_Request
 */
class Dto {
    static namespace = NS;
    /** @type {string} */
    backUUID;
    /** @type {string} */
    serverKey;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto_IEvent
 */
export default class TeqFw_Web_Shared_Event_Back_Stream_Reverse_Authenticate_Request {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Web_Shared_App_Event_Trans_Message} */
        const dtoBase = spec['TeqFw_Web_Shared_App_Event_Trans_Message$'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];

        // ENCLOSED VARS
        const ATTR = dtoBase.getAttributes();

        // ENCLOSED FUNCTIONS
        /**
         * @param {TeqFw_Web_Shared_Event_Back_Stream_Reverse_Authenticate_Request.Dto} [data]
         * @return {TeqFw_Web_Shared_Event_Back_Stream_Reverse_Authenticate_Request.Dto}
         */
        function createData(data) {
            const res = new Dto();
            res.backUUID = castString(data?.backUUID);
            res.serverKey = castString(data?.serverKey);
            return res;
        }

        // INSTANCE METHODS
        /**
         * @param {{data: TeqFw_Web_Shared_Event_Back_Stream_Reverse_Authenticate_Request.Dto, meta: TeqFw_Web_Shared_App_Event_Trans_Message_Meta.Dto}} [data]
         * @return {{data: TeqFw_Web_Shared_Event_Back_Stream_Reverse_Authenticate_Request.Dto, meta: TeqFw_Web_Shared_App_Event_Trans_Message_Meta.Dto}}
         */
        this.createDto = function (data) {
            const res = dtoBase.createDto({[ATTR.META]: data?.[ATTR.META]});
            res.meta.name = NS;
            res.data = createData(data?.[ATTR.DATA]);
            // noinspection JSValidateTypes
            return res;
        }

        this.getEventName = () => NS;
    }
}
