/**
 * Demo-process to send 'tik' events to the backend.
 */
export default class TeqFw_Web_Front_Proc_Tik {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Core_Shared_Logger} */
        const logger = spec['TeqFw_Core_Shared_Logger$'];
        /** @type {TeqFw_Web_Front_App_UUID} */
        const frontUUID = spec['TeqFw_Web_Front_App_UUID$'];
        /** @type {TeqFw_Web_Front_App_Event_Bus} */
        const eventBus = spec['TeqFw_Web_Front_App_Event_Bus$'];
        /** @type {TeqFw_Web_Front_App_Connect_Event_Direct_Portal} */
        const portalBack = spec['TeqFw_Web_Front_App_Connect_Event_Direct_Portal$'];
        /** @type {TeqFw_Web_Shared_Event_Front_Tik} */
        const esfTik = spec['TeqFw_Web_Shared_Event_Front_Tik$'];
        /** @type {TeqFw_Web_Shared_Event_Back_Tok} */
        const esbTok = spec['TeqFw_Web_Shared_Event_Back_Tok$'];
        /** @type {TeqFw_Web_Shared_Event_Back_Stream_Reverse_Opened} */
        const esbStreamOpened = spec['TeqFw_Web_Shared_Event_Back_Stream_Reverse_Opened$'];

        // MAIN FUNCTIONALITY
        eventBus.subscribe(esbStreamOpened.getEventName(), onStreamOpened);
        eventBus.subscribe(esbTok.getEventName(), onTok);

        // DEFINE INNER FUNCTIONS
        /**
         * Send 'tik' event to backend when back-to-front events stream is opened.
         * @param {TeqFw_Web_Shared_Event_Back_Stream_Reverse_Opened.Dto} evt
         */
        function onStreamOpened(evt) {
            const msg = esfTik.createDto();
            msg.frontUUID = frontUUID.get();
            // noinspection JSIgnoredPromiseFromCall
            portalBack.publish(msg);
            logger.info(`'Tik' event is sent to the back on 'Event Stream Opened'.`);
        }

        /**
         * Wait some time (0.1 - 1 sec.) after backend 'tok' event been received then send 'tik' event to server.
         * @param {TeqFw_Web_Shared_Event_Back_Tok.Dto} evt
         */
        function onTok(evt) {
            const timeout = Math.floor(Math.random() * 10);
            setTimeout(() => {
                const msg = esfTik.createDto();
                msg.frontUUID = frontUUID.get();
                // noinspection JSIgnoredPromiseFromCall
                portalBack.publish(msg);
                logger.info(`'Tik' event is sent to the back as an answer to backend 'tok'.`);
            }, timeout * 100);
        }
    }
}
