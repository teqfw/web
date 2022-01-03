/**
 * Data model for local event 'Reverse event stream is closed'.
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Front_Event_Stream_Reverse_Closed';

// MODULE'S CLASSES
/**
 * @memberOf TeqFw_Web_Front_Event_Stream_Reverse_Closed
 */
class Dto {
    static name = `${NS}.Dto`;
}

/**
 * @implements TeqFw_Core_Shared_Api_IEvent
 */
export default class TeqFw_Web_Front_Event_Stream_Reverse_Closed {
    constructor() {
        /**
         * @param [data]
         * @return {TeqFw_Web_Front_Event_Stream_Reverse_Closed.Dto}
         */
        this.createDto = (data) => new Dto();

        this.getName = () => NS;
    }
}
