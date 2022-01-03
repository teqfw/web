/**
 * Data model for local event 'Reverse event stream is opened'.
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Front_Event_Stream_Reverse_Opened';

// MODULE'S CLASSES
/**
 * @memberOf TeqFw_Web_Front_Event_Stream_Reverse_Opened
 */
class Dto {
    static name = `${NS}.Dto`;
}

/**
 * @implements TeqFw_Core_Shared_Api_IEvent
 */
export default class TeqFw_Web_Front_Event_Stream_Reverse_Opened {
    constructor() {
        /**
         * @param [data]
         * @return {TeqFw_Web_Front_Event_Stream_Reverse_Opened.Dto}
         */
        this.createDto = (data) => new Dto();

        this.getName = () => NS;
    }
}
