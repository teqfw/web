/**
 * Meta information for entities stored in IndexedDB.
 *
 * @interface
 * TODO: rename to `TeqFw_Web_Front_Api_Store_Meta`
 */
export default class TeqFw_Web_Front_Api_Store_IEntity {
    /**
     * Create entity DTO from given data.
     * @param [data]
     * @returns {Object}
     */
    createDto(data) {}

    /**
     * Get codifier for entity attributes.
     * @returns {*}
     */
    getAttributes() {}

    /**
     * Get entity name: '@vnd/plugin/path/to/entity'.
     * @returns {string}
     */
    getName() {}

    /**
     * Get codifier for entity indexes.
     * @returns {*}
     */
    getIndexes() {}

    /**
     * Get key attributes names for given index or for primary key if 'index' is omitted.
     * @param {string} [index]
     */
    getKeysForIndex(index) {}

    /**
     * Return array with primary keys for the entity.
     * @returns {string[]}
     */
    getPrimaryKey() {}
}
