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
        /** @type {TeqFw_Web_Back_Event_Stream_Reverse_Opened} */
        const ebStreamOpened = spec['TeqFw_Web_Back_Event_Stream_Reverse_Opened$'];

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
            const envelop = fQueueItem.create();
            envelop.backUUID = backUUID.get();
            envelop.eventData = eventPayload;
            envelop.eventName = eventName;
            envelop.frontUUID = frontUUID;
            const conn = registry.getByFrontUUID(frontUUID);
            if (conn) {
                conn.write(envelop);
                logger.info(`Event '${eventName}' is sent to front app '${frontUUID}'. `);
                // if (typeof _delayed[frontUUID] === 'object') {
                //     for (const dEvent of _delayed[frontUUID]) {
                //         /** @type {Object[]} */
                //         const payloads = _delayed[frontUUID][dEvent];
                //         let payload;
                //         while (payload = payloads.shift()) {
                //             // TODO: add connection state validation
                //             const isWritable = true; // conn.getState()
                //             if (isWritable) {
                //                 const dEnvelop = fQueueItem.create();
                //                 dEnvelop.backUUID = backUUID.get();
                //                 dEnvelop.eventData = payload;
                //                 dEnvelop.eventName = dEvent;
                //                 dEnvelop.frontUUID = frontUUID;
                //             } else {
                //                 // TODO: error handling
                //                 payloads.unshift(payload);
                //                 break;
                //             }
                //         }
                //         // clean empty events
                //         if (_delayed[frontUUID][dEvent].length === 0)
                //             delete _delayed[frontUUID][dEvent];
                //     }
                // }
            } else {
                logger.info(`Cannot send event '${eventName}' to front app '${frontUUID}'. `);
                if (!_delayed[frontUUID]) _delayed[frontUUID] = {};
                if (!_delayed[frontUUID][eventName]) _delayed[frontUUID][eventName] = [];
                _delayed[frontUUID][eventName].push(envelop);
            }
        }
    }
}
