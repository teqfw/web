/**
 * Transborder events queue (from back to front).
 *
 * @namespace TeqFw_Web_Back_App_Server_Handler_Event_Queue
 */
export default class TeqFw_Web_Back_App_Server_Handler_Event_Queue {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Core_Shared_Logger} */
        const logger = spec['TeqFw_Core_Shared_Logger$'];
        /** @type {TeqFw_Core_Back_App_UUID} */
        const backUUID = spec['TeqFw_Core_Back_App_UUID$'];
        /** @type {TeqFw_Web_Shared_App_Event_Queue_Trans_BfItem.Factory} */
        const fQueueItem = spec['TeqFw_Web_Shared_App_Event_Queue_Trans_BfItem.Factory$'];
        /** @type {TeqFw_Web_Back_App_Server_Handler_Event_Reverse_Registry} */
        const registry = spec['TeqFw_Web_Back_App_Server_Handler_Event_Reverse_Registry$'];

        // DEFINE INSTANCE METHODS
        /**
         *
         * @param {string} frontUUID
         * @param {string} eventName
         * @param {Object} eventPayload
         */
        this.add = function (frontUUID, eventName, eventPayload) {
            const envelop = fQueueItem.create();
            envelop.backUUID = backUUID.get();
            envelop.eventData = eventPayload;
            envelop.eventName = eventName;
            envelop.frontUUID = frontUUID;
            const conn = registry.getByFrontUUID(frontUUID);
            if (conn) {
                conn.write(envelop);
            } else {
                logger.info(`Cannot send event '${eventName}' to front app '${frontUUID}'. `);
            }
        }
    }
}
