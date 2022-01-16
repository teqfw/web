/**
 * Transborder events port to departure events messages from back to front.
 */
export default class TeqFw_Web_Back_App_Server_Handler_Event_Reverse_Portal {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Core_Shared_Logger} */
        const logger = spec['TeqFw_Core_Shared_Logger$'];
        /** @type {TeqFw_Core_Back_App_UUID} */
        const backUUID = spec['TeqFw_Core_Back_App_UUID$'];
        /** @type {TeqFw_Web_Back_App_Server_Handler_Event_Reverse_Registry} */
        const registry = spec['TeqFw_Web_Back_App_Server_Handler_Event_Reverse_Registry$'];

        // INSTANCE METHODS
        /**
         * @param {TeqFw_Web_Shared_App_Event_Trans_Message.Dto|*} message
         */
        this.publish = function (message) {
            const meta = message?.meta;
            const eventName = meta?.name;
            const uuid = meta?.uuid;
            const frontUUID = meta?.frontUUID;
            meta.backUUID = backUUID.get();
            const conn = registry.getByFrontUUID(frontUUID);
            if (conn) {
                conn.write(message);
                logger.info(`<= ${frontUUID} / ${uuid}: ${eventName}`);
            } else {
                logger.info(`Cannot send event '${eventName}' (${uuid}) to front app '${frontUUID}'. `);
            }
        }
    }

}
