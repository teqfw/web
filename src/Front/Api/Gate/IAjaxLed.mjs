/**
 * Interface for object that indicates AJAX request execution on the front.
 * @interface
 * @deprecated we should use events here
 */
export default class TeqFw_Web_Front_Api_Gate_IAjaxLed {
    /**
     * Switch 'Ajax LED' on (request to server is started).
     */
    on() {}

    /**
     * Switch 'Ajax LED' off (request to server is completed).
     */
    off() {}

    /**
     * Reset 'Ajax LED'.
     */
    reset() {}
}
