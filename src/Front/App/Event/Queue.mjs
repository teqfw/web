/**
 * Transborder events queue (from front to back).
 *
 * @namespace TeqFw_Web_Front_App_Event_Queue
 */
export default class TeqFw_Web_Front_App_Event_Queue {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Core_Shared_Logger} */
        const logger = spec['TeqFw_Core_Shared_Logger$'];
        /** @type {TeqFw_Web_Front_App_Connect_Event_Direct} */
        const conn = spec['TeqFw_Web_Front_App_Connect_Event_Direct$'];
        /** @type {TeqFw_Web_Front_App_UUID} */
        const frontUUID = spec['TeqFw_Web_Front_App_UUID$'];
        /** @type {TeqFw_Web_Front_App_Back_UUID} */
        const backUUID = spec['TeqFw_Web_Front_App_Back_UUID$'];
        /** @type {TeqFw_Web_Shared_App_Event_Queue_Trans_BfItem.Factory} */
        const fQueueItem = spec['TeqFw_Web_Shared_App_Event_Queue_Trans_BfItem.Factory$'];

        // DEFINE INSTANCE METHODS
        /**
         * @param {string} eventName
         * @param {Object} eventData
         */
        this.add = async function (eventName, eventData) {
            const envelop = fQueueItem.create({eventName, eventData});
            envelop.backUUID = backUUID.get();
            envelop.frontUUID = frontUUID.get();
            if (conn) {
                await conn.send(envelop);
            } else {
                logger.info(`Cannot send event '${eventName}' to the back. `);
            }
        }
    }
}
