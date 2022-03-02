/**
 * Transborder events port to departure events messages from back to front.
 */
export default class TeqFw_Web_Back_App_Server_Handler_Event_Reverse_Portal {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Api_ILogger} */
        const logger = spec['TeqFw_Core_Shared_Api_ILogger$$']; // instance
        /** @type {TeqFw_Core_Back_Mod_App_Uuid} */
        const backUuid = spec['TeqFw_Core_Back_Mod_App_Uuid$'];
        /** @type {TeqFw_Core_Back_App_Event_Bus} */
        const eventsBack = spec['TeqFw_Core_Back_App_Event_Bus$'];
        /** @type {TeqFw_Web_Back_Mod_Event_Reverse_Registry} */
        const registry = spec['TeqFw_Web_Back_Mod_Event_Reverse_Registry$'];
        /** @type {TeqFw_Web_Back_Mod_Event_Queue} */
        const modQueue = spec['TeqFw_Web_Back_Mod_Event_Queue$'];
        /** @type {TeqFw_Web_Shared_App_Event_Trans_Message} */
        const dtoEvent = spec['TeqFw_Web_Shared_App_Event_Trans_Message$'];
        /** @type {TeqFw_Core_Back_Mod_App_Uuid} */
        const modBackUuid = spec['TeqFw_Core_Back_Mod_App_Uuid$'];
        /** @type {TeqFw_Web_Shared_Dto_Log_Meta_Event} */
        const dtoLogMeta = spec['TeqFw_Web_Shared_Dto_Log_Meta_Event$'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castDate|function} */
        const castDate = spec['TeqFw_Core_Shared_Util_Cast.castDate'];
        /** @type {TeqFw_Web_Back_Event_Republish_Delayed} */
        const ebRepublishDelayed = spec['TeqFw_Web_Back_Event_Republish_Delayed$'];

        // MAIN
        logger.setNamespace(this.constructor.name);

        // INSTANCE METHODS
        /**
         * @param {TeqFw_Web_Shared_App_Event_Trans_Message.Dto|*} event
         * @param {boolean} useUnAuthStream send event to unauthenticated stream
         * @return {Promise<boolean>}
         */
        this.publish = async function (event, {useUnAuthStream} = {}) {
            // FUNCS
            /**
             * @param {TeqFw_Web_Shared_App_Event_Trans_Message_Meta.Dto} meta
             */
            function logEvent(meta) {
                const logMeta = dtoLogMeta.createDto();
                logMeta.backUuid = modBackUuid.get();
                logMeta.eventName = meta.name;
                logMeta.eventUuid = meta.uuid;
                logMeta.frontUuid = meta.frontUUID;
                logger.info(`${meta.frontUUID} <= ${meta.name} (${meta.uuid})`, logMeta);
            }

            // MAIN
            let res = false;
            const meta = event?.meta;
            const eventName = meta?.name;
            const uuid = meta?.uuid;
            const frontUuid = meta?.frontUUID;
            meta.backUUID = backUuid.get();
            const activeOnly = !useUnAuthStream;
            const conn = registry.getByFrontUUID(frontUuid, activeOnly);
            if (conn) {
                // TODO: save message to queue on write failure
                conn.write(event);
                logEvent(meta);
                res = true;
            } else {
                logger.info(`Event ${eventName} (${uuid}) cannot be published on offline front #${frontUuid}. `);
                await modQueue.save(event);
            }
            return res;
        }

        /**
         * Re-publish delayed events for given front.
         * @param {number} frontId front app ID in back RDB
         * @param {string} frontUuid
         * @return {Promise<void>}
         */
        this.sendDelayedEvents = async function (frontId, frontUuid) {
            let count = 0;
            /** @type {TeqFw_Web_Back_Store_RDb_Schema_Event_Queue.Dto[]} */
            const found = await modQueue.getEventsByFrontUuid(frontUuid);
            const now = new Date();
            for (const one of found) {
                count++;
                const eventId = one.id;
                logger.info(`Process delayed event #${eventId}.`);
                const data = JSON.parse(one.message);
                const event = dtoEvent.createDto(data);
                const meta = event.meta;
                const dateEvent = castDate(meta.expiration);
                if (dateEvent < now)
                    await modQueue.removeEvent(eventId); // just remove expired events
                else { // ... and process not expired
                    const conn = registry.getByFrontUUID(frontUuid);
                    if (conn) {
                        conn.write(event);
                        logger.info(`<= ${frontUuid} / ${meta.uuid}: ${meta.name}`);
                        await modQueue.removeEvent(eventId);
                    } else {
                        // connection is closed, break the loop
                        break;
                    }
                }
            }
            if (count > 0) {
                logger.info(`Total ${count} delayed events were processed for front #${frontUuid}.`, {frontUuid});
                const event = ebRepublishDelayed.createDto();
                event.data.count = count;
                event.data.frontId = frontId;
                event.data.frontUuid = frontUuid;
                eventsBack.publish(event);
            }
        }
    }
}
