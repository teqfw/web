/**
 * Data model for transborder events queue.
 * This is transport envelop for transborder events data.
 */
export default class TeqFw_Web_Back_Server_Event_Queue_Item {
    /** @type {string} */
    backUUID;
    /** @type {Object} */
    eventData;
    /** @type {string} */
    eventName;
    /** @type {string} */
    frontUUID;
}

/**
 * @implements TeqFw_Core_Shared_Api_Sync_IFactory
 * @memberOf TeqFw_Web_Back_Server_Event_Queue_Item
 */
export class Factory {

    /**
     *
     * @param [opts]
     * @return {TeqFw_Web_Back_Server_Event_Queue_Item}
     */
    create(opts) {
        return new TeqFw_Web_Back_Server_Event_Queue_Item();
    }
}
