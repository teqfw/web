/**
 * Queue for 'front-to-back' delayed events.
 *
 * @namespace TeqFw_Web_Front_Store_Entity_Event_Delayed
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Front_Store_Entity_Event_Delayed';
/**
 * Part of the entity key to store in Singletons IDB store.
 * @type {string}
 */
const ENTITY = '/event/delayed';

/**
 * @memberOf TeqFw_Web_Front_Store_Entity_Event_Delayed
 * @type {Object}
 */
const ATTR = {
    DATE: 'meta.published',
    UUID: 'meta.uuid',
};

/**
 * @memberOf TeqFw_Web_Front_Store_Entity_Event_Delayed
 */
const INDEX = {
    BY_DATE: 'by_date'
}

/**
 * @memberOf TeqFw_Web_Front_Store_Entity_Event_Delayed
 */
class Dto {
    static namespace = NS;
}

/**
 * @implements TeqFw_Web_Front_Api_Store_IEntity
 */
export default class TeqFw_Web_Front_Store_Entity_Event_Delayed {

    constructor() {

        /**
         * @param {TeqFw_Web_Front_Store_Entity_Event_Delayed.Dto} [data]
         * @return {TeqFw_Web_Front_Store_Entity_Event_Delayed.Dto}
         */
        this.createDto = function (data) {
            const res = Object.assign(new Dto(), data);
            return res;
        }
    }

    /**
     * @return {typeof TeqFw_Web_Front_Store_Entity_Event_Delayed.ATTR}
     */
    getAttributes = () => ATTR;

    getAttrNames = () => Object.values(ATTR);

    getEntityName = () => ENTITY;

    /**
     * @return {typeof TeqFw_Web_Front_Store_Entity_Event_Delayed.INDEX}
     */
    getIndexes = () => INDEX;

    getPrimaryKey = () => [ATTR.UUID];

    getKeysForIndex(index) {
        if (index === INDEX.BY_DATE) return [ATTR.DATE];
        // else if (index === INDEX.BY_UUID) return [ATTR.UUID];
        return this.getPrimaryKey();
    }
}
