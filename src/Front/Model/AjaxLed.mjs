/**
 * Default implementation for 'Ajax LED' indicator.
 * @implements TeqFw_Web_Front_Api_Gate_IAjaxLed
 */
export default class TeqFw_Web_Front_Model_AjaxLed {
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
