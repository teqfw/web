/**
 * Demo-process to send 'tok' events to the front.
 *
 * @namespace TeqFw_Web_Back_Proc_Tok
 */
export default class TeqFw_Web_Back_Proc_Tok {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Core_Back_App_Event_Bus} */
        const eventsBack = spec['TeqFw_Core_Back_App_Event_Bus$'];
        /** @type {TeqFw_Web_Back_App_Server_Handler_Event_Reverse_Portal} */
        const portal = spec['TeqFw_Web_Back_App_Server_Handler_Event_Reverse_Portal$'];
        /** @type {TeqFw_Web_Shared_Event_Back_Tok} */
        const esbTok = spec['TeqFw_Web_Shared_Event_Back_Tok$'];
        /** @type {TeqFw_Web_Shared_Event_Front_Tik} */
        const esfTik = spec['TeqFw_Web_Shared_Event_Front_Tik$'];

        // MAIN FUNCTIONALITY
        eventsBack.subscribe(esfTik.getEventName(), handler)

        // DEFINE INNER FUNCTIONS
        /**
         * @param {TeqFw_Web_Shared_Event_Front_Tik.Dto} evt
         */
        function handler(evt) {
            const timeout = Math.floor(Math.random() * 10) * 100;
            setTimeout(() => {
                const msg = esbTok.createDto();
                msg.data.timeout = timeout;
                portal.publish(msg);
            }, timeout);
        }
    }
}
