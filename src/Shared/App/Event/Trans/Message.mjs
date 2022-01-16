/**
 * Base structure for transborder event message.
 * @namespace TeqFw_Web_Shared_App_Event_Trans_Message
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Shared_App_Event_Trans_Message';

// MODULE'S CLASSES
/**
 * @memberOf TeqFw_Web_Shared_App_Event_Trans_Message
 * @type {Object}
 */
const ATTR = {
    DATA: 'data',
    META: 'meta',
};

/**
 * @memberOf TeqFw_Web_Shared_App_Event_Trans_Message
 * @extends TeqFw_Core_Shared_App_Event_Message.Dto
 */
class Dto {
    static namespace = NS;
    /** @type {Object} */
    data;
    /** @type {TeqFw_Web_Shared_App_Event_Trans_Message_Meta.Dto} */
    meta;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto_IMeta
 */
export default class TeqFw_Web_Shared_App_Event_Trans_Message {
    constructor(spec) {
        /** @type {TeqFw_Core_Shared_Dto_Formless} */
        const dtoFormless = spec['TeqFw_Core_Shared_Dto_Formless$'];
        /** @type {TeqFw_Web_Shared_App_Event_Trans_Message_Meta} */
        const dtoMeta = spec['TeqFw_Web_Shared_App_Event_Trans_Message_Meta$'];

        // INSTANCE METHODS
        /**
         * @param {TeqFw_Web_Shared_App_Event_Trans_Message.Dto|*} data
         * @return {TeqFw_Web_Shared_App_Event_Trans_Message.Dto}
         */
        this.createDto = function (data = null) {
            const res = new Dto();
            res.data = dtoFormless.createDto(data?.[ATTR.DATA]);
            res.meta = dtoMeta.createDto(data?.[ATTR.META]);
            return res;
        }


        this.getAttributes = () => ATTR;

        this.getAttrNames = () => Object.values(ATTR);
    }
}
