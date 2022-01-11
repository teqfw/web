/**
 * Transborder events queue (from back to front).
 *
 * @namespace TeqFw_Web_Back_App_Server_Handler_Event_Queue
 * @deprecated use TeqFw_Web_Back_App_Server_Handler_Event_Reverse_Portal
 */
export default class TeqFw_Web_Back_App_Server_Handler_Event_Queue {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Core_Shared_Logger} */
        const logger = spec['TeqFw_Core_Shared_Logger$'];
        /** @type {TeqFw_Core_Back_App_UUID} */
        const backUUID = spec['TeqFw_Core_Back_App_UUID$'];
        // /** @type {TeqFw_Web_Shared_App_Event_Queue_Trans_BfItem.Factory} */
        // const fQueueItem = spec['TeqFw_Web_Shared_App_Event_Queue_Trans_BfItem.Factory$'];
        /** @type {TeqFw_Web_Back_App_Server_Handler_Event_Reverse_Registry} */
        const registry = spec['TeqFw_Web_Back_App_Server_Handler_Event_Reverse_Registry$'];

        // DEFINE WORKING VARS / PROPS
        const _delayed = {};

        // DEFINE INSTANCE METHODS
        /**
         *
         * @param {string} frontUUID
         * @param {string} eventName
         * @param {Object} eventPayload
         */
        this.add = function (frontUUID, eventName, eventPayload) {
            const envelope = fQueueItem.create();
            envelope.backUUID = backUUID.get();
            envelope.eventData = eventPayload;
            envelope.eventName = eventName;
            envelope.frontUUID = frontUUID;
            const conn = registry.getByFrontUUID(frontUUID);
            if (conn) {
                conn.write(envelope);
                logger.info(`Event '${eventName}' is sent to front app '${frontUUID}'. `);
            } else {
                logger.info(`Cannot send event '${eventName}' to front app '${frontUUID}'. `);
                if (!_delayed[frontUUID]) _delayed[frontUUID] = {};
                if (!_delayed[frontUUID][eventName]) _delayed[frontUUID][eventName] = [];
                _delayed[frontUUID][eventName].push(envelope);
            }
        }
    }
}
