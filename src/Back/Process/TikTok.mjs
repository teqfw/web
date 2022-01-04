/**
 * Some process that starts when new Reverse Events Stream opened and sends 'tik' events to the stream.
 *
 * @namespace TeqFw_Web_Back_Process_TikTok
 */
export default class TeqFw_Web_Back_Process_TikTok {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Web_Back_App_Server_Handler_Event_Reverse} */
        const reverseStreamsHandler = spec['TeqFw_Web_Back_App_Server_Handler_Event_Reverse$'];
        /** @type {TeqFw_Web_Back_App_Server_Event_Stream_Reverse_Registry} */
        const regStreamsReverse = spec['TeqFw_Web_Back_App_Server_Event_Stream_Reverse_Registry$'];
        /** @type {TeqFw_Web_Back_App_Server_Event_Queue} */
        const eventQueue = spec['TeqFw_Web_Back_App_Server_Event_Queue$'];
        /** @type {TeqFw_Web_Back_Event_Stream_Reverse_Opened} */
        const ebOpened = spec['TeqFw_Web_Back_Event_Stream_Reverse_Opened$'];
        /** @type {TeqFw_Web_Shared_Event_TikTok} */
        const esTikTok = spec['TeqFw_Web_Shared_Event_TikTok$'];

        // DEFINE WORKING VARS / PROPS

        // DEFINE INNER FUNCTIONS

        // DEFINE INSTANCE METHODS
        this.init = function () {
            reverseStreamsHandler.subscribe(ebOpened.getName(), (event) => {
                /** @type {TeqFw_Web_Shared_Event_Stream_Reverse_Opened.Dto} */
                const evt = event;
                const frontUUID = evt.frontUUID;
                const interval = setInterval(() => {
                    const item = eventQueue.createItem();
                    item.frontUUID = frontUUID;
                    item.eventName = esTikTok.getName();
                    item.eventData = esTikTok.createDto();
                    eventQueue.add(frontUUID, esTikTok.getName(), esTikTok.createDto());
                }, 2000);
                // close stream after 20 sec.
                const conn = regStreamsReverse.get(evt.streamUUID);
                setTimeout(() => {
                    clearInterval(interval);
                    if (conn)
                        conn.finalize();
                }, 1000 * 20);
            });
        }
        // MAIN FUNCTIONALITY
    }
}
