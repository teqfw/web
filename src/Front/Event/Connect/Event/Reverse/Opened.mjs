/**
 * Frontend local event 'Reverse event stream is opened'.
 * TODO: use this event or TeqFw_Web_Front_Api_Mod_Server_Connect_IState model
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Front_Event_Connect_Event_Reverse_Opened';

// MODULE'S CLASSES
/**
 * @memberOf TeqFw_Web_Front_Event_Connect_Event_Reverse_Opened
 */
class Dto {
    static namespace = NS;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto_IEvent
 */
export default class TeqFw_Web_Front_Event_Connect_Event_Reverse_Opened {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_App_Event_Message} */
        const dtoBase = spec['TeqFw_Core_Shared_App_Event_Message$'];

        // VARS
        const ATTR = dtoBase.getAttributes();

        // FUNCS
        /**
         * @param {TeqFw_Web_Front_Event_Connect_Event_Reverse_Opened.Dto} [data]
         * @return {TeqFw_Web_Front_Event_Connect_Event_Reverse_Opened.Dto}
         */
        function createData(data) {
            const res = new Dto();
            return res;
        }

        // INSTANCE METHODS
        /**
         * @param {{[data]: TeqFw_Web_Front_Event_Connect_Event_Reverse_Opened.Dto, [meta]: TeqFw_Core_Shared_App_Event_Message_Meta.Dto}} [data]
         * @return {{data: TeqFw_Web_Front_Event_Connect_Event_Reverse_Opened.Dto, meta: TeqFw_Core_Shared_App_Event_Message_Meta.Dto}}
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
