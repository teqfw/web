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
        /** @type {TeqFw_Web_Front_App_UUID} */
        const frontUUID = spec['TeqFw_Web_Front_App_UUID$'];
        /** @type {TeqFw_Web_Front_App_Back_UUID} */
        const backUUID = spec['TeqFw_Web_Front_App_Back_UUID$'];
        /** @type {TeqFw_Web_Front_App_Store_IDB} */
        const idb = spec['TeqFw_Web_Front_Store_Db$']; // plugin's local IDB
        /** @type {TeqFw_Web_Front_Store_Entity_Event_Delayed} */
        const idbQueue = spec['TeqFw_Web_Front_Store_Entity_Event_Delayed$'];

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


        // INSTANCE METHODS
        /**
         * @param {TeqFw_Web_Shared_App_Event_Trans_Message.Dto|*} event
         * @return {Promise<void>}
         */
        this.publish = async function (event) {
            const meta = event.meta;
            meta.backUUID = backUUID.get();
            meta.frontUUID = frontUUID.get();
            await saveToQueue(event);
            const sent = await conn.send(event);
            if (sent) await removeFromQueue(meta?.uuid);
        }
    }
}
