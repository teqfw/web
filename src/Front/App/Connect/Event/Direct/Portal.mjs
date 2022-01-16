/**
 * Transborder events port to departure events messages from front to back.
 *
 * @namespace TeqFw_Web_Front_App_Connect_Event_Direct_Portal
 */
export default class TeqFw_Web_Front_App_Connect_Event_Direct_Portal {
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

        // INSTANCE METHODS
        /**
         * @param {TeqFw_Web_Shared_App_Event_Trans_Message.Dto|*} message
         */
        this.publish = function (message) {
            const meta = message?.meta;
            const eventName = meta?.name;
            const uuid = meta?.uuid;
            meta.backUUID = backUUID.get();
            meta.frontUUID = frontUUID.get();
            if (conn) {
                // noinspection JSIgnoredPromiseFromCall
                conn.send(message);
                logger.info(`<= ${meta.backUUID} / ${uuid} : ${eventName}`);
            } else {
                logger.info(`Cannot send event '${eventName}' to the back. `);
            }
        }
    }
}
