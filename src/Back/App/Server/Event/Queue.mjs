/**
 * Transborder events queue (from back to front).
 *
 * @namespace TeqFw_Web_Back_App_Server_Event_Queue
 */
export default class TeqFw_Web_Back_App_Server_Event_Queue {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Core_Shared_Logger} */
        const logger = spec['TeqFw_Core_Shared_Logger$'];
        /** @type {TeqFw_Web_Back_App_Server_Event_Stream_Reverse_Registry} */
        const registry = spec['TeqFw_Web_Back_App_Server_Event_Stream_Reverse_Registry$'];
        /** @type {TeqFw_Web_Back_App_Server_Event_Queue_Item.Factory} */
        const factory = spec['TeqFw_Web_Back_App_Server_Event_Queue_Item.Factory$'];
        /** @type {TeqFw_Core_Back_App_UUID} */
        const backUUID = spec['TeqFw_Core_Back_App_UUID$'];

        // DEFINE WORKING VARS / PROPS
        // MAIN FUNCTIONALITY
        // DEFINE INNER FUNCTIONS

        // DEFINE INSTANCE METHODS
        /**
         *
         * @param {string} frontUUID
         * @param {string} eventName
         * @param {Object} eventMessage
         */
        this.add = function (frontUUID, eventName, eventMessage) {
            const envelop = factory.create();
            envelop.backUUID = backUUID.get();
            envelop.eventData = eventMessage;
            envelop.eventName = eventName;
            envelop.frontUUID = frontUUID;
            const conn = registry.getByFrontUUID(frontUUID);
            if (conn) {
                conn.write(envelop);
            } else {
                logger.info(`Cannot send event '${eventName}' to front app '${frontUUID}'. `);
            }
        }

        /**
         * Create empty queue item to populate with data before add to queue.
         * @return {TeqFw_Web_Back_App_Server_Event_Queue_Item}
         */
        this.createItem = () => factory.create();
    }
}
