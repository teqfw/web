/**
 * Delayed events queue.
 *
 * @namespace TeqFw_Web_Back_Mod_Event_Queue
 */
export default class TeqFw_Web_Back_Mod_Event_Queue {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Api_ILogger} */
        const logger = spec['TeqFw_Core_Shared_Api_ILogger$'];
        /** @type {TeqFw_Db_Back_RDb_IConnect} */
        const rdb = spec['TeqFw_Db_Back_RDb_IConnect$'];
        /** @type {TeqFw_Db_Back_Api_RDb_ICrudEngine} */
        const crud = spec['TeqFw_Db_Back_Api_RDb_ICrudEngine$'];
        /** @type {TeqFw_Web_Back_Store_RDb_Schema_Event_Queue} */
        const rdbQueue = spec['TeqFw_Web_Back_Store_RDb_Schema_Event_Queue$'];
        /** @type {TeqFw_Web_Back_Act_Front_GetIdByUuid.act|function} */
        const actGetIdByUuid = spec['TeqFw_Web_Back_Act_Front_GetIdByUuid$'];

        // ENCLOSED VARS
        /** @type {typeof TeqFw_Web_Back_Store_RDb_Schema_Event_Queue.ATTR} */
        const A_QUEUE = rdbQueue.getAttributes();

        // MAIN

        // ENCLOSED FUNCS

        // INSTANCE METHODS

        /**
         * Save event to RDB.
         * @param {TeqFw_Web_Shared_App_Event_Trans_Message.Dto} event
         * @return {Promise<void>}
         */
        this.save = async function (event) {
            const trx = await rdb.startTransaction();
            try {
                const {id: frontId} = await actGetIdByUuid({trx, uuid: event.meta.frontUUID});
                const dto = rdbQueue.createDto();
                dto.message = JSON.stringify(event);
                dto.front_ref = frontId;
                const pk = await crud.create(trx, rdbQueue, dto);
                logger.info(`Event message #${event.meta.uuid} is saved to backend queue as #${pk[A_QUEUE.ID]}.`);
                await trx.commit();
            } catch (e) {
                logger.error(`Cannot save event #${event?.meta?.uuid} to queue. Error: ${e.message}`);
                await trx.rollback();
            }
        }
        /**
         * Get all delayed events by front UUID.
         * @param {string} uuid
         * @return {Promise<TeqFw_Web_Back_Store_RDb_Schema_Event_Queue.Dto[]>}
         */
        this.getEventsByFrontUuid = async function (uuid) {
            const res = [];
            const trx = await rdb.startTransaction();
            try {
                const {id} = await actGetIdByUuid({trx, uuid});
                const where = {[A_QUEUE.FRONT_REF]: id};
                /** @type {TeqFw_Web_Back_Store_RDb_Schema_Event_Queue.Dto[]} */
                const items = await crud.readSet(trx, rdbQueue, where);
                await trx.commit();
                res.push(...items);
            } catch (e) {
                await trx.rollback();
            }
            return res;
        }

        /**
         * Remove one delayed event by event ID.
         * @param {number} id
         * @return {Promise<boolean>}
         */
        this.removeEvent = async function (id) {
            let res = false;
            const trx = await rdb.startTransaction();
            try {
                const where = {[A_QUEUE.ID]: id};
                const rs = await crud.deleteOne(trx, rdbQueue, where);
                res = (rs === 1);
                await trx.commit();
                logger.info(`Delayed event #${id} is removed from queue.`);
            } catch (e) {
                logger.error(`Cannot remove delayed event #${id}. Error: ${e.message}`);
                await trx.rollback();
            }
            return res;
        }

    }
}
