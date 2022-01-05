/**
 * Object with this interface is used by 'TeqFw_Web_Front_App_Connect_Event_Reverse' to report
 * about SSE connection state changes.
 *
 * This is default implementation, use app's 'teqfw.json' to replace with app specific implementation.
 *
 * TODO: refactor this object, we have no simple state for the moment
 *
 * @interface
 */
export default class TeqFw_Web_Front_Api_Event_Stream_Reverse_IState {
    closed() {
        console.log(`SSE connection closed.`);
    }

    connected() {
        console.log(`SSE connection opened.`);
    }

    error(e) {
        console.log(`Error in SSE connection.`);
        console.dir(e);
    }
}
