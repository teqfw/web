/**
 * Demo-process to send 'tok' events to the front.
 *
 * @namespace TeqFw_Web_Back_Proc_Tok
 */
export default class TeqFw_Web_Back_Proc_Tok {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Core_Back_App_UUID} */
        const backUUID = spec['TeqFw_Core_Back_App_UUID$'];
        /** @type {TeqFw_Web_Back_App_Server_Handler_Event_Queue} */
        const backQueue = spec['TeqFw_Web_Back_App_Server_Handler_Event_Queue$'];
        /** @type {TeqFw_Web_Back_App_Server_Handler_Event_Embassy} */
        const frontEmbassy = spec['TeqFw_Web_Back_App_Server_Handler_Event_Embassy$'];
        /** @type {TeqFw_Web_Shared_Event_Back_Tok} */
        const esbTok = spec['TeqFw_Web_Shared_Event_Back_Tok$'];
        /** @type {TeqFw_Web_Shared_Event_Front_Tik} */
        const esfTik = spec['TeqFw_Web_Shared_Event_Front_Tik$'];

        // MAIN FUNCTIONALITY
        frontEmbassy.subscribe(esfTik.getName(), handler)

        // DEFINE INNER FUNCTIONS
        /**
         * @param {TeqFw_Web_Shared_Event_Front_Tik.Dto} evt
         */
        function handler(evt) {
            const timeout = Math.floor(Math.random() * 100);
            setTimeout(() => {
                const msg = esbTok.createDto();
                msg.backUUID = backUUID.get();
                backQueue.add(evt.frontUUID, esbTok.getName(), msg);
            }, timeout * 100);
        }
    }
}
