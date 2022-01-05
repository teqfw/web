/**
 * Data model for front-to-back queue item.
 * This is transport envelop for transborder events data.
 * Frontend queue and backend embassy both use this envelop.
 */
export default class TeqFw_Web_Shared_App_Event_Queue_Trans_FbItem {
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
 * @memberOf TeqFw_Web_Shared_App_Event_Queue_Trans_FbItem
 */
export class Factory {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Core_Shared_Util.isObject|function} */
        const isObject = spec['TeqFw_Core_Shared_Util.isObject'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];

        // DEFINE INSTANCE METHODS
        /**
         *
         * @param {TeqFw_Web_Shared_App_Event_Queue_Trans_FbItem|Object} [data]
         * @return {TeqFw_Web_Shared_App_Event_Queue_Trans_FbItem}
         */
        this.create = function (data) {
            const res = new TeqFw_Web_Shared_App_Event_Queue_Trans_FbItem();
            res.backUUID = castString(data?.backUUID);
            res.eventData = isObject(data?.eventData) ? data.eventData : {};
            res.eventName = castString(data?.eventName);
            res.frontUUID = castString(data?.frontUUID);
            return res;
        }
    }
}
