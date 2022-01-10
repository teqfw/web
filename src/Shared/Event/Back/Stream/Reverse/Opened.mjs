/**
 * Shared backend event 'Reverse event stream is opened'.
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Shared_Event_Back_Stream_Reverse_Opened';

// MODULE'S CLASSES
/**
 * @memberOf TeqFw_Web_Shared_Event_Back_Stream_Reverse_Opened
 */
class Dto {
    static namespace = `${NS}.Dto`;
    /** @type {string} */
    backUUID;
    /** @type {string} */
    frontUUID;
    /** @type {string} */
    streamUUID;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto_IEvent
 */
export default class TeqFw_Web_Shared_Event_Back_Stream_Reverse_Opened {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Web_Shared_App_Event_Trans_Message} */
        const dtoBase = spec['TeqFw_Web_Shared_App_Event_Trans_Message$'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];

        // ENCLOSED VARS
        const ATTR = dtoBase.getAttributes();

        // ENCLOSED FUNCTIONS
        /**
         * @param {TeqFw_Web_Shared_Event_Back_Stream_Reverse_Opened.Dto} [data]
         * @return {TeqFw_Web_Shared_Event_Back_Stream_Reverse_Opened.Dto}
         */
        function createData(data) {
            const res = new Dto();
            res.backUUID = castString(data?.backUUID);
            res.frontUUID = castString(data?.frontUUID);
            res.streamUUID = castString(data?.streamUUID);
            return res;
        }

        // INSTANCE METHODS
        /**
         * @param {{data: TeqFw_Web_Shared_Event_Back_Stream_Reverse_Opened.Dto, meta: TeqFw_Web_Shared_App_Event_Trans_Message_Meta.Dto}} [data]
         * @return {{data: TeqFw_Web_Shared_Event_Back_Stream_Reverse_Opened.Dto, meta: TeqFw_Web_Shared_App_Event_Trans_Message_Meta.Dto}}
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
