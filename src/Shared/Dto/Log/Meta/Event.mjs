/**
 * Logs metadata for entries related to web communication using events.
 * @deprecated remove after 2023/06/01
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Shared_Dto_Log_Meta_Event';

/**
 * @memberOf TeqFw_Web_Shared_Dto_Log_Meta_Event
 * @type {Object}
 * @deprecated don't use event related functionality in web plugin
 */
const ATTR = {
    BACK_UUID: 'backUuid',
    EVENT_NAME: 'eventName',
    EVENT_UUID: 'eventUuid',
    FRONT_UUID: 'frontUuid',
    SESSION_UUID: 'sessionUuid',
};

// MODULE'S CLASSES
/**
 * @memberOf TeqFw_Web_Shared_Dto_Log_Meta_Event
 * @deprecated don't use event related functionality in web plugin
 */
class Dto {
    static namespace = NS;
    /** @type {string} */
    backUuid;
    /** @type {string} */
    eventName;
    /** @type {string} */
    eventUuid;
    /** @type {string} */
    streamUuid;
    /** @type {string} */
    sessionUuid;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto_Meta
 * @deprecated don't use event related functionality in web plugin
 */
export default class TeqFw_Web_Shared_Dto_Log_Meta_Event {

    constructor(spec) {
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];

        // INSTANCE METHODS
        /**
         * @param {TeqFw_Web_Shared_Dto_Log_Meta_Event.Dto} [data]
         * @return {TeqFw_Web_Shared_Dto_Log_Meta_Event.Dto}
         */
        this.createDto = function (data) {
            const res = new Dto();
            res.backUuid = castString(data?.backUuid);
            res.eventName = castString(data?.eventName);
            res.eventUuid = castString(data?.eventUuid);
            res.streamUuid = castString(data?.streamUuid);
            res.sessionUuid = castString(data?.sessionUuid);
            return res;
        }

        this.getAttributes = () => ATTR;
    }

}

// finalize code components for this es6-module
Object.freeze(ATTR);
