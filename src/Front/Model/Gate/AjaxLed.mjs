/**
 * Default implementation for 'Ajax LED' indicator.
 * @implements TeqFw_Web_Front_Api_Gate_IAjaxLed
 * @deprecated we should use events here
 */
export default class TeqFw_Web_Front_Model_Gate_AjaxLed {
    on() {
        console.log('Ajax LED On');
    }

    off() {
        console.log('Ajax LED Off');
    }

    reset() {
        console.log('Ajax LED Reset');
    }
}
