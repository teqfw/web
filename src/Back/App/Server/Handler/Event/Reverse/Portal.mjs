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
        /** @type {TeqFw_Web_Back_Mod_Event_Reverse_Registry} */
        const registry = spec['TeqFw_Web_Back_Mod_Event_Reverse_Registry$'];
        /** @type {TeqFw_Web_Back_Mod_Event_Queue} */
        const modQueue = spec['TeqFw_Web_Back_Mod_Event_Queue$'];
        /** @type {TeqFw_Web_Shared_App_Event_Trans_Message} */
        const dtoEvent = spec['TeqFw_Web_Shared_App_Event_Trans_Message$'];

        // INSTANCE METHODS
        /**
         * @param {TeqFw_Web_Shared_App_Event_Trans_Message.Dto|*} event
         * @param {boolean} useUnAuthStream send event to unauthenticated stream
         * @return {Promise<void>}
         */
        this.publish = async function (event, {useUnAuthStream} = {}) {
            const meta = event?.meta;
            const eventName = meta?.name;
            const uuid = meta?.uuid;
            const frontUUID = meta?.frontUUID;
            meta.backUUID = backUUID.get();
            const activeOnly = !useUnAuthStream;
            const conn = registry.getByFrontUUID(frontUUID, activeOnly);
            if (conn) {
                // TODO: save message to queue on write failure
                conn.write(event);
                logger.info(`<= ${frontUUID} / ${uuid}: ${eventName}`);
            } else {
                logger.info(`Cannot send event '${eventName}' (${uuid}) to front app '${frontUUID}'. `);
                await modQueue.save(event);
            }
        }

        this.sendDelayedEvents = async function (frontUuid) {
            /** @type {TeqFw_Web_Back_Store_RDb_Schema_Event_Queue.Dto[]} */
            const found = await modQueue.getEventsByFrontUuid(frontUuid);
            for (const one of found) {
                const eventId = one.id;
                logger.info(`Process delayed event #${eventId}.`);
                const data = JSON.parse(one.message);
                const event = dtoEvent.createDto(data);
                const meta = event.meta;
                const conn = registry.getByFrontUUID(frontUuid);
                if (conn) {
                    // TODO: save message to queue on write failure
                    conn.write(event);
                    logger.info(`<= ${frontUuid} / ${meta.uuid}: ${meta.name}`);
                    await modQueue.removeEvent(eventId);
                } else {
                    // connection is closed, break the loop
                    break;
                }
            }
        }
    }
}
