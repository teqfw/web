/**
 * Demo-process to send 'tik' events to the backend.
 */
export default class TeqFw_Web_Front_Proc_Tik {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Web_Front_App_UUID} */
        const frontUUID = spec['TeqFw_Web_Front_App_UUID$'];
        /** @type {TeqFw_Web_Front_App_Event_Queue} */
        const frontQueue = spec['TeqFw_Web_Front_App_Event_Queue$'];
        /** @type {TeqFw_Web_Front_App_Event_Embassy} */
        const backEmbassy = spec['TeqFw_Web_Front_App_Event_Embassy$'];
        /** @type {TeqFw_Web_Shared_Event_Front_Tik} */
        const esfTik = spec['TeqFw_Web_Shared_Event_Front_Tik$'];
        /** @type {TeqFw_Web_Shared_Event_Back_Tok} */
        const esbTok = spec['TeqFw_Web_Shared_Event_Back_Tok$'];
        /** @type {TeqFw_Web_Shared_Event_Back_Stream_Reverse_Opened} */
        const esbStreamOpened = spec['TeqFw_Web_Shared_Event_Back_Stream_Reverse_Opened$'];

        // MAIN FUNCTIONALITY
        backEmbassy.subscribe(esbStreamOpened.getName(), onStreamOpened);
        backEmbassy.subscribe(esbTok.getName(), onTok);

        // DEFINE INNER FUNCTIONS
        /**
         * @param {TeqFw_Web_Shared_Event_Back_Stream_Reverse_Opened.Dto} evt
         */
        function onStreamOpened(evt) {
            console.log(`'Reverse stream opened' event on the back: ${evt.backUUID}`);
            const timeout = Math.floor(Math.random() * 100);
            setTimeout(() => {
                const msg = esfTik.createDto();
                msg.frontUUID = frontUUID.get();
                // noinspection JSIgnoredPromiseFromCall
                frontQueue.add(esfTik.getName(), msg);
            }, timeout * 10);
        }

        /**
         * @param {TeqFw_Web_Shared_Event_Back_Tok.Dto} evt
         */
        function onTok(evt) {
            const timeout = Math.floor(Math.random() * 100);
            setTimeout(() => {
                const msg = esfTik.createDto();
                msg.frontUUID = frontUUID.get();
                // noinspection JSIgnoredPromiseFromCall
                frontQueue.add(esfTik.getName(), msg);
            }, timeout * 100);
        }
    }
}
