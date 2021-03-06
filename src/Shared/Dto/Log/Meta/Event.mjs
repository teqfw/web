/**
 * Logs metadata for entries related to web communication using events.
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Shared_Dto_Log_Meta_Event';

/**
 * @memberOf TeqFw_Web_Shared_Dto_Log_Meta_Event
 * @type {Object}
 */
const ATTR = {
    BACK_UUID: 'backUuid',
    EVENT_NAME: 'eventName',
    EVENT_UUID: 'eventUuid',
    FRONT_UUID: 'frontUuid',
};

// MODULE'S CLASSES
/**
 * @memberOf TeqFw_Web_Shared_Dto_Log_Meta_Event
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
    frontUuid;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto_IMeta
 */
export default class TeqFw_Web_Shared_Dto_Log_Meta_Event {

    constructor(spec) {
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];

        // INSTANCE METHODS
        /**
         * @param {TeqFw_Web_Shared_Dto_Log_Meta_Event.Dto} data
         * @return {TeqFw_Web_Shared_Dto_Log_Meta_Event.Dto}
         */
        this.createDto = function (data = null) {
            const res = new Dto();
            res.backUuid = castString(data?.backUuid);
            res.eventName = castString(data?.eventName);
            res.eventUuid = castString(data?.eventUuid);
            res.frontUuid = castString(data?.frontUuid);
            return res;
        }

        this.getAttributes = () => ATTR;

        this.getAttrNames = () => Object.values(ATTR);
    }

}

// finalize code components for this es6-module
Object.freeze(ATTR);
