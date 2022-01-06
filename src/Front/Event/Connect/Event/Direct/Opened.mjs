/**
 * Data model for local event 'Direct event stream is opened'.
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Front_Event_Connect_Event_Direct_Opened';

// MODULE'S CLASSES
/**
 * @memberOf TeqFw_Web_Front_Event_Connect_Event_Direct_Opened
 */
class Dto {
    static namespace = `${NS}.Dto`;
}

/**
 * @implements TeqFw_Core_Shared_Api_IEvent
 */
export default class TeqFw_Web_Front_Event_Connect_Event_Direct_Opened {
    constructor() {
        /**
         * @param [data]
         * @return {TeqFw_Web_Front_Event_Connect_Event_Direct_Opened.Dto}
         */
        this.createDto = (data) => new Dto();

        this.getName = () => NS;
    }
}
