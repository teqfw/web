/**
 * Data model for local event 'Direct event stream is closed'.
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Front_Event_Connect_Event_Direct_Closed';

// MODULE'S CLASSES
/**
 * @memberOf TeqFw_Web_Front_Event_Connect_Event_Direct_Closed
 */
class Dto {
    static namespace = `${NS}.Dto`;
}

/**
 * @implements TeqFw_Core_Shared_Api_IEvent
 */
export default class TeqFw_Web_Front_Event_Connect_Event_Direct_Closed {
    constructor() {
        /**
         * @param [data]
         * @return {TeqFw_Web_Front_Event_Connect_Event_Direct_Closed.Dto}
         */
        this.createDto = (data) => new Dto();

        this.getName = () => NS;
    }
}
