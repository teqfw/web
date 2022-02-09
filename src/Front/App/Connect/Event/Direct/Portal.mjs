/**
 * Transborder events portal to departure events messages from front to back.
 *
 * @namespace TeqFw_Web_Front_App_Connect_Event_Direct_Portal
 */
export default class TeqFw_Web_Front_App_Connect_Event_Direct_Portal {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Web_Front_App_Connect_Event_Direct} */
        const conn = spec['TeqFw_Web_Front_App_Connect_Event_Direct$'];
        /** @type {TeqFw_Web_Front_Mod_App_Front_Identity} */
        const frontIdentity = spec['TeqFw_Web_Front_Mod_App_Front_Identity$'];
        /** @type {TeqFw_Web_Front_Mod_App_Back_Identity} */
        const backIdentity = spec['TeqFw_Web_Front_Mod_App_Back_Identity$'];
        /** @type {TeqFw_Web_Front_App_Store_IDB} */
        const idb = spec['TeqFw_Web_Front_Store_Db$']; // plugin's local IDB
        /** @type {TeqFw_Web_Front_Store_Entity_Event_Delayed} */
        const idbQueue = spec['TeqFw_Web_Front_Store_Entity_Event_Delayed$'];
        /** @type {TeqFw_Web_Front_App_Event_Bus} */
        const eventBus = spec['TeqFw_Web_Front_App_Event_Bus$'];
        /** @type {TeqFw_Web_Shared_Event_Back_Stream_Reverse_Authenticated} */
        const esbAuthenticated = spec['TeqFw_Web_Shared_Event_Back_Stream_Reverse_Authenticated$'];

        // ENCLOSED VARS
        const I_DELAYED = idbQueue.getIndexes();

        // MAIN
        eventBus.subscribe(esbAuthenticated.getEventName(), onReverseAuthenticated);

        // ENCLOSED FUNCTIONS
        /**
         * Queue event message before sending to back.
         * @param {TeqFw_Web_Shared_App_Event_Trans_Message.Dto} event
         * @return {Promise<string>}
         */
        async function saveToQueue(event) {
            const trx = await idb.startTransaction([idbQueue]);
            // noinspection JSCheckFunctionSignatures
            const dto = idbQueue.createDto(event);
            const id = await idb.create(trx, idbQueue, dto);
            trx.commit();
            return id;
        }

        /**
         * Remove sent event from the queue.
         * @param {string} uuid
         * @return {Promise<void>}
         */
        async function removeFromQueue(uuid) {
            const trx = await idb.startTransaction([idbQueue]);
            const res = await idb.deleteOne(trx, idbQueue, uuid);
            trx.commit();
            return res;
        }

        async function onReverseAuthenticated() {
            // ENCLOSED FUNCS
            async function getDelayedEvents() {
                const trx = await idb.startTransaction([idbQueue]);
                const res = await idb.readSet(trx, idbQueue, I_DELAYED.BY_DATE);
                trx.commit();
                return res;
            }

            // MAIN
            const events = await getDelayedEvents();
            for (const event of events) {
                const sent = await conn.send(event);
                if (sent) await removeFromQueue(event.meta.uuid);
            }
        }

        // INSTANCE METHODS
        /**
         * @param {TeqFw_Web_Shared_App_Event_Trans_Message.Dto|*} event
         * @return {Promise<void>}
         */
        this.publish = async function (event) {
            const meta = event.meta;
            meta.backUUID = backIdentity.getUUID();
            meta.frontUUID = frontIdentity.getUuid();
            await saveToQueue(event);
            const sent = await conn.send(event);
            if (sent) await removeFromQueue(meta?.uuid);
        }
    }
}
