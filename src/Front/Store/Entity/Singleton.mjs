/**
 * Store to save front application's singletons (simple hashtable).
 *
 * @namespace TeqFw_Web_Front_Store_Entity_Singleton
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Front_Store_Entity_Singleton';
/**
 * Part of the entity key to store in Singletons IDB store.
 * @type {string}
 */
const ENTITY = '/singleton';

/**
 * @memberOf TeqFw_Web_Front_Store_Entity_Singleton
 * @type {Object}
 */
const ATTR = {
    KEY: 'key',
    VALUE: 'value',
};

/**
 * @memberOf TeqFw_Web_Front_Store_Entity_Singleton
 */
const INDEX = {}

/**
 * @memberOf TeqFw_Web_Front_Store_Entity_Singleton
 */
class Dto {
    static namespace = NS;
    /** @type {string} */
    key;
    /** @type {*} */
    value;
}

/**
 * @implements TeqFw_Web_Front_Api_Store_IEntity
 */
export default class TeqFw_Web_Front_Store_Entity_Singleton {
    /**
     * @param {TeqFw_Core_Shared_Util_Cast.castString|function} castString
     */

    constructor(
        {
            'TeqFw_Core_Shared_Util_Cast.castString': castString,
        }) {
        // INSTANCE METHODS
        /**
         * @param {TeqFw_Web_Front_Store_Entity_Singleton.Dto} [data]
         * @return {TeqFw_Web_Front_Store_Entity_Singleton.Dto}
         */
        this.createDto = function (data) {
            const res = new Dto();
            res.key = castString(data?.key);
            res.value = structuredClone(data?.value);
            return res;
        }
    }

    /**
     * @return {typeof TeqFw_Web_Front_Store_Entity_Singleton.ATTR}
     */
    getAttributes = () => ATTR;

    getEntityName = () => {
        throw new Error('Deprecated, use `getName`.');
    };

    getName = () => ENTITY;

    /**
     * @return {typeof TeqFw_Web_Front_Store_Entity_Singleton.INDEX}
     */
    getIndexes = () => INDEX;

    getPrimaryKey = () => [ATTR.KEY];

    getKeysForIndex(index) {
        return this.getPrimaryKey();
    }
}
