/**
 * Front is successfully authenticated by back.
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Shared_Event_Back_Stream_Reverse_Authenticated';

// MODULE'S CLASSES
/**
 * @memberOf TeqFw_Web_Shared_Event_Back_Stream_Reverse_Authenticated
 */
class Dto {
    static namespace = NS;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto_IEvent
 */
export default class TeqFw_Web_Shared_Event_Back_Stream_Reverse_Authenticated {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Web_Shared_App_Event_Trans_Message} */
        const dtoBase = spec['TeqFw_Web_Shared_App_Event_Trans_Message$'];

        // ENCLOSED VARS
        const ATTR = dtoBase.getAttributes();

        // ENCLOSED FUNCTIONS
        /**
         * @param {TeqFw_Web_Shared_Event_Back_Stream_Reverse_Authenticated.Dto} [data]
         * @return {TeqFw_Web_Shared_Event_Back_Stream_Reverse_Authenticated.Dto}
         */
        function createData(data) {
            const res = new Dto();
            return res;
        }

        // INSTANCE METHODS
        /**
         * @param {{data: TeqFw_Web_Shared_Event_Back_Stream_Reverse_Authenticated.Dto, meta: TeqFw_Web_Shared_App_Event_Trans_Message_Meta.Dto}} [data]
         * @return {{data: TeqFw_Web_Shared_Event_Back_Stream_Reverse_Authenticated.Dto, meta: TeqFw_Web_Shared_App_Event_Trans_Message_Meta.Dto}}
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
